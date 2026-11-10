---
name: generate-lab
description: Generate a draft Fluento lab (e.g. Creator Studio) from a lab skill and a brief, in the foreground so every step shows live in the terminal. Use when the user runs /fluento-lab:generate-lab or asks to generate a lab and wants to watch progress.
argument-hint: <show idea, level, studio template id, optional format / unit / "save as <email>">
---

Generate the lab yourself, in this conversation. Do not hand it to the lab-generator subagent: a
subagent runs in the background and the user can't see its progress.

Read `${CLAUDE_PLUGIN_ROOT}/agents/lab-generator.md` (this plugin's lab-generator agent) and follow it
exactly as if you were that agent: the one rule, the tools, the plan file, every step in "How to work"
(including the status line before each step) and the final report.

The brief: $ARGUMENTS

If the level or the studio template is missing, ask the user with the options from `get_context` instead
of stopping, then carry on.
