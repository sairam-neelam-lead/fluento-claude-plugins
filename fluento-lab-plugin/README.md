# fluento-lab (Claude Code plugin)

Generates draft Fluento labs. It holds the `lab-generator` agent, the `/fluento-lab:generate-lab` skill,
and a small MCP server (`mcp/server.js`) that calls the admin backend's `/api/v1/lab-agent` API
(`admin/backend/src/routes/labAgent.js` in the pipecat-testing-tool repo). Lab skills themselves stay in that
repo's `admin/backend/skills/`; the backend serves them.

## Needs

- Node 20+ as your default `node` (`nvm alias default 20`)
- Two settings, in `~/.claude/settings.json` (works for the terminal, VS Code and the desktop app):

```json
{
  "env": {
    "ADMIN_API_KEY": "<admin backend API key>",
    "LAB_AGENT_API_URL": "https://dev-flowbuilder-fluento.leadschool.in/be/api/v1"
  }
}
```

`LAB_AGENT_API_URL` defaults to dev. For a local backend use `https://dev-flowbuilder-fluento.leadschool.in/be/api/v1`.
Never commit the key.

## Try it locally (while developing the plugin)

```bash
claude --plugin-dir ~/Code/fluento-claude-plugins/fluento-lab-plugin   # this session only
```

After editing plugin files, run `/reload-plugins`.

## Install (teammates)

```
/plugin marketplace add <org>/fluento-claude-plugins      # the GitHub repo (or a local path while testing)
/plugin install fluento-lab@fluento
```

Get updates later with `/plugin marketplace update fluento`.

Desktop app: Code tab, **+**, **Add plugins**. Plugins installed in the terminal show up there too.

## Use

```
/fluento-lab:generate-lab cooking show, Level B, studio template 5
```

Or ask "generate a Creator Studio lab about …" and the `lab-generator` agent runs in the background.
Plans are written to `~/fluento-labs/<slug>/plan.json`.
