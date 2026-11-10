# Lab generation skills

Skills describe how a kind of lab or activity is built. The lab generator reads them; the AI fills
content **slots**, and code assembles stages, prompts and flows from them
(see `Skill-Based Lab Generation Architecture.md` at the repo root).

```
skills/
  global/style.md                    one global skill, included in every AI call
  labs/<lab-skill>/SKILL.md          one per kind of lab; picks and configures activity skills
  activities/<activity-skill>/SKILL.md   generic building blocks, usable by any lab skill
  assets/                            shared snapshot of layouts, base flows and images (see Snapshots)
```

Current skills:

| Skill | Kind | What it builds |
|---|---|---|
| `global/style.md` | global | House rules: learners, Curie persona, safety, prompt and tag conventions, default evaluation prompt |
| `labs/creator-studio` | lab | A lab whose last activity records the learner presenting a short show, rendered into a Creator Studio video |
| `labs/role-play-lab` | lab | A real-life exchange (ordering food, buying at a shop…): practise the sentences, then do it with a partner character. `practice_and_staged_play` runs the extended, staged role play |
| `labs/language-lesson` | lab | One language point (good at vs good in, a or an, much or many…): Curie teaches it, checks it and the learner uses it in their own sentences |
| `labs/conversation` | lab | A conversation unit week: the learner builds a short personal talk on a topic, then speaks about it unaided (week 1: the "before" video) |
| `activities/intro-hook` | activity | Short opening: Curie greets and announces what the learner will do and who they will be |
| `activities/script-builder` | activity | Curie asks questions, the learner's answers build a personal script, the learner reads it aloud |
| `activities/gesture-practice` | activity | A tutor video pauses after each line; the learner repeats it with a gesture. Needs recorded clips |
| `activities/script-recording` | activity | The learner records the full personal script. `practice` or `final` mode |
| `activities/choose-and-record` | activity | The learner picks one of two ready-made scripts, reads it and records it |
| `activities/speech-prep` | activity | Curie asks open questions; answers given through sentence starters build a short talk the learner says twice |
| `activities/choose-and-say` | activity | For each choice, the learner clicks one of three options, then says it in the target sentence |
| `activities/role-play` | activity | A partner character from the Character library has the exchange with the learner; Curie steps in to help |
| `activities/staged-role-play` | activity | The same, as a whole conversation in stages set by the lab content's `phases`; each phase is a talk (the partner's line + the learner's reply, naming earlier choices as `[key]`) or a choose |
| `activities/explain-and-practise` | activity | Teaches a language point in three stages: Learn (each rule with examples on screen, focus words in pink), Check (choose the word for each blank) and My Turn (the learner's own sentences), then a recap |
| `activities/closing` | activity | Last activity: Curie praises the learner and says goodbye |
| `activities/free-talk` | activity | The learner speaks about the topic on their own, with only the points to cover on screen; recorded |

## Lab skills and activity skills

**Activity skills know nothing about any particular lab.** They read the shared content (below), fill
their own slots, and produce stages and a prompt. A lab skill picks activity skills in its blueprint
and adds what is specific to it, per entry:

| Blueprint field | Meaning |
|---|---|
| `skill`, `mode` | Which activity skill, and which of its modes |
| `key` | Name of this activity inside the lab (used by `memory_from`) |
| `required`, `include_when` | Whether it's always included, or only when a brief input is given |
| `activity_fields` | Merged over the activity skill's own fields, e.g. `{ is_creator_studio: true, record_video_type: creator_studio }` |
| `video_template: required` | The activity is linked to the brief's existing studio template (never copied) |
| `notes` | Told to the AI writing this activity's lines, e.g. what happens to the recording |
| `memory_from` | `key` of the activity whose stored choices this one reads (`{{ memory.activity(id) }}`) |

YAML anchors keep repeated settings in one place (see `creator_studio_recording` in the Creator Studio
lab skill).

### Content every activity skill can read

The lab skill's blueprint step writes this once; each activity skill says which parts it reads.

| Field | Shape | Read by |
|---|---|---|
| `theme` | `{ role, title, setting?, intro_line }`: who the learner is, what they make, where | all |
| `script` | lines `{ text, gesture, gesture_caption, stress[] }`; `[key]` marks a learner's choice | script-builder, script-recording, gesture-practice |
| `variables` | `{ key, stage_name, question, sentence, options[3], default }` | script-builder, script-recording, gesture-practice |
| `rules` | `{ when_key, when_value, not_allowed_key, not_allowed[] }` | script-builder |
| `topics` | `{ key, button_label, short_name, thumbnail, script }` | choose-and-record |
| `questions` | `{ key, stage_name, question, starters[1–2], show_options, help_ideas }`; a starter's blank is `[key]` / `[key_2]` in `script` | speech-prep (with `script`) |
| `challenge` | `{ lines, points[] }` | free-talk |
| `partner` | `{ character, avatar?, voice?, role }`: `character` is a Character library name (its avatar, and the `<speaker>` name); `voice` the one whose TTS voice is used (default: `character`); never copied | role-play |
| `choices` | `{ key, stage_name, label, choose_question, partner_question, options[3], sentence, option_images? }` | choose-and-say, role-play |

A new lab skill that provides these can use any of the activity skills unchanged.

## Where they are used

| Piece | Location |
|---|---|
| Claude Code agent (writes the content and slots, checks and reviews them) | the fluento-lab Claude Code plugin (`fluento-lab-plugin/agents/lab-generator.md` in the fluento-claude-plugins repo) |
| The agent's tools | `src/services/skillLab/agentTools.js`, over HTTP at `/api/v1/lab-agent` (`src/routes/labAgent.js`) for the plugin's MCP server, and on the command line via `scripts/lab-agent.js` |
| Loader + template rendering | `src/services/skillLab/skills.js` (cached per process: restart the backend after editing a skill) |
| Checks and assembly | `src/services/skillLab/index.js` |
| Activity skills' computed fields and stage dressing | `src/services/skillLab/activities.js` (one entry per activity skill) |
| Lab skill specifics (content checks) | `src/services/skillLab/creatorStudio.js`, `conversation.js`, `rolePlayLab.js` |
| Snapshot loading | `src/services/skillLab/snapshot.js` |
| Rendered stage images | `src/services/skillLab/cards.js` |
| Tests | `src/services/skillLab/skillLab.test.js` |

A new activity skill needs an entry in `activities.js`. A new lab skill needs a module beside
`creatorStudio.js`, registered in `LAB_MODULES` in `index.js`.

## File format

Each skill is Markdown with YAML frontmatter.

- **Frontmatter** holds everything code reads: ids, version, activity fields, stage blueprint, slots,
  asset slots, snapshot layout and base flow names.
- **Body** holds what the AI reads: purpose, writing guidance, rules, and the prompt templates in
  fenced blocks under fixed headings (`## Bot prompt template`, `## Evaluation prompt`).

`version` is an integer. Bump it on any change that would change generated output. Every generated
lab records the skill ids and versions it used.

## Placeholders

Three kinds of placeholder appear in templates. They never collide.

| Syntax | Filled by | When | Example |
|---|---|---|---|
| `<<name>>`, `<<#list>>…<</list>>`, `<<^list>>…<</list>>` | The generator (Mustache with `<< >>` delimiters, HTML escaping **off**) | At generation | `<<theme.title>>` |
| `{{ memory.activity(id) }}` | Chat server, from `student_memory` | At session start | `<<memory_ref>>` renders to `{{ memory.activity(774) }}` |
| The literal words `Vangipurapu` and `Hindi` / `hindi` | Chat server | At session start | Replaced with the student's name and preferred language |

The generator creates all of a lab's activities first, then writes the prompts, so `memory_ref` can
use real activity ids.

Never write a real student name or language into a template: use `Vangipurapu` and `Hindi`.

## Asset slot kinds

| Kind | Meaning |
|---|---|
| `reuse` | Upload the snapshot's file into the new lab's folder unchanged (generic backgrounds, character sprites) |
| `library` | An image the agent may choose from the asset library (`src/models/asset.js`) to fit the lab; the plan's `assets` holds the choice. When nothing fits, the agent generates a picture (`lab-agent.js assets generate`, `src/services/assetGenerator.js`) and adds it to the library. `item: background` (key `<activity key>.<stage key>.background`): a 16:9 background for a plain scenery stage, never where a card, banner or text panel is placed on it; without a choice the snapshot background stays. `item: button thumbnails` (key `<activity key>.button.<button label>`): a static-sprite picture on each button, labels from the activity's `buttonLabels` in `activities.js`; without a choice the button shows words only and is flagged. `item: board` (key `<activity key>.<stage key>.board`): a static-sprite picture of the stage's board (e.g. the role-play menu); its option names must match the lab content; without a choice the board is rendered from the content. `item: props, spots: [...]` (key `<activity key>.<stage key>.<item key>.<spot>`, one per repeat of the stage and spot, e.g. per role-play phase): a static sprite placed on the layout's empty static sprite of that name; an empty spot is removed |
| `render` | Render from content with an HTML template (question cards, script cards, banners) |
| `image` | One picture per item. Not generated yet; listed for the author to add |
| `production` | Needs a person to produce it (tutor videos, transition videos). Never generated; always flagged |

## Characters

Layouts never carry character pictures. A character sprite is a placeholder: `character` names an
entry in the Character library (`src/models/Character.js`) and the sprite name one of its avatars
(empty → the first). At generation, `placeCharacters` in `src/services/skillLab/index.js` fills each
one from the library: the avatar's S3 key (referenced, never copied), frame size and scale. Curie is fitted to
her placeholder's height (the bubble shrinks her); any other character (the role-play partner) keeps
its avatar's own size and scale, centred on the placeholder, as the stage editor adds it.

- **Curie** placeholders are named `curie` (full body) or `curie_in_bubble`. The lab skill picks her
  look with `defaults.curie`: `default`, or `news_reporter` for the `curie_news_reporter*` avatars
  (Creator Studio).
- **Other characters** (e.g. the role-play partner) are set on the layout's `partner` placeholder by the
  activity's assembly code, from the content.

## Snapshots (layouts, base flows, images)

Stage layouts, base flows and their images are one shared library in the repo, named after the
activity skill that uses them:

```
skills/assets/
  sources.yaml   where the snapshot came from (gold lab ids in dev) and what was stripped
  layouts.json   named stage layouts, e.g. "script-builder.question"; images as "skill-asset:<file>"
  layouts.authored.json   hand-written generic layouts with no gold lab behind them (choose-and-say,
                 role-play); never touched by the snapshot script. They may only use images the
                 snapshot already has, and leave topic and character sprites empty for the generator
                 to fill
  flows/*.json   base flows without their prompt or component ids, e.g. "script-recording.final"
  images/        the images the layouts use (topic art is stripped, never stored)
```

Activity skills refer to them by name: `layout: script-builder.question`,
`background: { from: script-builder.conclusion }`,
`background: { base: choose-and-record.transition, banner: "…" }`, `base_flow: script-recording.final`.
The generator never reads the gold labs, so they can be edited or deleted, and generation works in
any environment: images are uploaded into each new lab's folder, and flow components are looked up by
name.

To change the look on purpose, edit `sources.yaml`, run `node scripts/snapshot-skill-exemplars.js`
against dev, review the diff, and bump the versions of the skills that use the changed layouts or flows.
