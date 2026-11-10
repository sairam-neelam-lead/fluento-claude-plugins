# Fluento Claude Code plugins

A Claude Code plugin marketplace. Plugins:

| Plugin | What it does |
|---|---|
| [fluento-lab](fluento-lab-plugin/README.md) | Generates draft Fluento labs through the admin backend's `/api/v1/lab-agent` API |

## Install

```
/plugin marketplace add <org>/fluento-claude-plugins
/plugin install fluento-lab@fluento
```

Then set `ADMIN_API_KEY` and `LAB_AGENT_API_URL` (see the plugin's README).
