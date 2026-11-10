---
name: lab-skills
description: Fluento lab skills (Creator Studio, role play, language lesson, conversation) and their activity skills, used to write a draft lab's content and slots. Load when generating a Fluento lab (the lab-generator agent or /fluento-lab:generate-lab).
user-invocable: false
---

Every lab skill, activity skill and the global style live as files in this skill's folder. Read only the
ones the lab you're building needs, with Read, using the paths below relative to this folder.

| File | What it is |
|---|---|
| `format-guide.md` | The skill format: what each frontmatter field and body section means, how lab and activity skills fit together, and a table of every skill. Read it once at the start. |
| `global/style.md` | `global-style`: house rules every lab follows (learners, Curie, safety, prompt and tag conventions) |
| `labs/<id>/SKILL.md` | A lab skill: `conversation`, `creator-studio`, `language-lesson`, `role-play-lab`. Its frontmatter has the brief `inputs`, `limits` and, per format, the activity entries (skill, mode, notes, memory_from) |
| `activities/<id>/SKILL.md` | An activity skill: `choose-and-record`, `choose-and-say`, `closing`, `explain-and-practise`, `free-talk`, `gesture-practice`, `intro-hook`, `role-play`, `script-builder`, `script-recording`, `speech-prep`, `staged-role-play`. Its frontmatter has the `slots` (key, max_words, instruction) and `assets`; its body has the writing guidance and the bot prompt template |

A skill's id is its `id:` frontmatter field (the folder name, or `global-style` for `global/style.md`).

These files are copies of the admin backend's `admin/backend/skills/` (pipecat-testing-tool repo). The
backend's `check_plan` and `save_plan` validate against its own copy, so the two must stay in sync. Never
edit a skill to make a check pass; if one looks wrong, say so in your report.
