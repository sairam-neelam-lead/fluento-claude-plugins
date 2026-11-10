#!/usr/bin/env node
// MCP server (stdio) for the lab-generator agent. Lab skills ship as the plugin's lab-skills skill; this
// server only calls the admin backend's /lab-agent API
// (admin/backend/src/routes/labAgent.js) and keeps files local: plan files, rendered prompts, downloaded images.
// No dependencies; needs Node 20 (built-in fetch).
//   LAB_AGENT_API_URL  admin API base, e.g. https://dev-flowbuilder-fluento.leadschool.in/be/api/v1
//   ADMIN_API_KEY      the admin backend's API key
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

if (Number(process.versions.node.split('.')[0]) < 20) {
	console.error(`fluento-lab MCP server needs Node 20+, got ${process.version}. Run: nvm alias default 20`);
	process.exit(1);
}

const BASE = `${(process.env.LAB_AGENT_API_URL || '').replace(/\/$/, '')}/lab-agent`;
const ASSET_DIR = path.join(os.tmpdir(), 'fluento-lab', 'assets');

async function request(method, url, body, binary) {
	const res = await fetch(url, {
		method,
		headers: binary ? {} : { 'x-api-key': process.env.ADMIN_API_KEY || '', 'content-type': 'application/json' },
		body: body === undefined ? undefined : JSON.stringify(body),
	});
	if (!res.ok) throw new Error(`${method} ${url}: ${res.status} ${(await res.text()).slice(0, 500)}`);
	if (binary) return Buffer.from(await res.arrayBuffer());
	const text = await res.text();
	try {
		return JSON.parse(text);
	} catch {
		throw new Error(`${method} ${url}: not JSON: ${text.slice(0, 200)}`);
	}
}
const api = (method, route, body) => request(method, BASE + route, body);

// Saves an asset's image locally so the agent can open it with Read.
async function download({ url, ...info }) {
	fs.mkdirSync(ASSET_DIR, { recursive: true });
	const file = path.join(ASSET_DIR, `${info.id}.${info.format}`);
	fs.writeFileSync(file, await request('GET', url, undefined, true));
	return { file, ...info };
}

const readPlan = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const writePlan = (p, plan) => fs.writeFileSync(p, JSON.stringify(plan, null, 2));
const qs = (o) => new URLSearchParams(Object.entries(o).filter(([, v]) => v !== undefined && v !== '')).toString();

const str = { type: 'string' };
const TOOLS = {
	get_context: {
		description: 'Gesture model names, characters, voices, classes (levels) and studio templates.',
		schema: {},
		run: () => api('GET', '/context'),
	},
	search_assets: {
		description: 'Images from the asset library ranked by how well their tags, setting, genre and description match the query. kind: background (default; 16:9, no text) or static_sprite (button pictures, boards, props).',
		schema: { query: str, kind: { type: 'string', enum: ['background', 'static_sprite'] }, setting: str, genre: str, limit: { type: 'number' } },
		required: ['query'],
		run: (a) => api('GET', `/assets?${qs(a)}`),
	},
	get_asset: {
		description: 'Downloads an asset image to a local file and returns its path and tags, so you can open it with Read and look.',
		schema: { id: str },
		required: ['id'],
		run: async ({ id }) => download(await api('GET', `/assets/${encodeURIComponent(id)}`)),
	},
	generate_asset: {
		description: 'When nothing in the library fits: draws the picture, adds it to the asset library, tags it, downloads it and returns its id, path and tags. Costs money and writes to the database and S3.',
		schema: { kind: { type: 'string', enum: ['background', 'static_sprite'] }, prompt: str, setting: str, genre: str },
		required: ['kind', 'prompt'],
		run: async (a) => download(await api('POST', '/assets/generate', a)),
	},
	check_plan: {
		description: "Normalises the content in the plan file (rewrites it), lists every error saving would hit, and writes each activity's rendered bot prompt to prompts/<key>.txt next to the plan.",
		schema: { plan_path: str },
		required: ['plan_path'],
		run: async ({ plan_path }) => {
			const { plan, prompts = {}, ...result } = await api('POST', '/check', { plan: readPlan(plan_path) });
			if (plan) writePlan(plan_path, plan);
			const dir = path.join(path.dirname(plan_path), 'prompts');
			fs.mkdirSync(dir, { recursive: true });
			for (const [key, text] of Object.entries(prompts)) fs.writeFileSync(path.join(dir, `${key}.txt`), text);
			return { ...result, prompts: Object.keys(prompts).map((k) => path.join(dir, `${k}.txt`)) };
		},
	},
	save_plan: {
		description: "Checks, then creates the draft lab (or rebuilds the plan's labId / lab_id in place) and records labId in the plan file. Writes to the database. Only when the user asked to save.",
		schema: { plan_path: str, user: { type: 'string', description: 'author email' }, lab_id: str },
		required: ['plan_path', 'user'],
		run: async ({ plan_path, user, lab_id }) => {
			const { plan, ...result } = await api('POST', '/save', { plan: readPlan(plan_path), user, labId: lab_id });
			if (plan) writePlan(plan_path, plan);
			return result;
		},
	},
};

async function handle(msg) {
	const { method, params } = msg;
	if (method === 'initialize')
		return { protocolVersion: params.protocolVersion || '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'fluento-lab-agent', version: '0.1.0' } };
	if (method === 'ping') return {};
	if (method === 'tools/list')
		return { tools: Object.entries(TOOLS).map(([name, t]) => ({ name, description: t.description, inputSchema: { type: 'object', properties: t.schema, required: t.required || [] } })) };
	if (method === 'tools/call') {
		const tool = TOOLS[params.name];
		if (!tool) throw Object.assign(new Error(`Unknown tool ${params.name}`), { code: -32602 });
		try {
			if (!process.env.LAB_AGENT_API_URL || !process.env.ADMIN_API_KEY) throw new Error('Set LAB_AGENT_API_URL and ADMIN_API_KEY (see the fluento-lab plugin README).');
			return { content: [{ type: 'text', text: JSON.stringify(await tool.run(params.arguments || {}), null, 2) }] };
		} catch (e) {
			return { content: [{ type: 'text', text: e.message }], isError: true };
		}
	}
	throw Object.assign(new Error(`Method not found: ${method}`), { code: -32601 });
}

const send = (m) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...m }) + '\n');
readline.createInterface({ input: process.stdin }).on('line', async (line) => {
	if (!line.trim()) return;
	let msg;
	try {
		msg = JSON.parse(line);
	} catch {
		return send({ id: null, error: { code: -32700, message: 'Parse error' } });
	}
	if (msg.id === undefined) return; // a notification
	try {
		send({ id: msg.id, result: await handle(msg) });
	} catch (e) {
		send({ id: msg.id, error: { code: e.code || -32603, message: e.message } });
	}
});
