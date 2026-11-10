---
id: choose-and-record
kind: activity
version: 4
activity_type_id: "1"            # Introduction
activity_fields: { name: Choose and Record, record_video: true, duration: 5 }
base_flow: choose-and-record     # speech-to-text keeps word-level timestamps
# Reads: theme, topics. Lab-specific flags (e.g. Creator Studio), a studio template and `notes` on what
# happens to the recording come from the lab blueprint.

stages:
  - key: select
    name: Select Topic
    type: no voice input
    layout: choose-and-record.select  # two topic buttons + Curie
    # The gold lab's backgrounds said "Hello Reporters!" / "News Report" with reporter kids, so the
    # select, prepare and record stages get a plain teal background with a rendered banner instead.
    background: { base: choose-and-record.transition, banner: "Hello! Which one would you like to present today?" }
  - key: prepare
    repeat: topics
    name: "Speech Preparation <<short_name>>"
    type: no voice input
    layout: choose-and-record.prepare # script card sprite + Ready button
    background: { base: choose-and-record.transition, banner: "Read your script and get ready" }
  - key: record
    repeat: topics
    name: "Record Speech <<short_name>>"
    type: record
    layout: choose-and-record.record  # script card sprite + camera frame
    background: { base: choose-and-record.transition, banner: "Click Record when you are ready" }
  - key: transition
    name: Transition
    type: default
    layout: choose-and-record.transition
  - key: end
    name: End
    type: default
    layout: choose-and-record.end

slots:
  - key: select_line
    max_words: 30
    instruction: Curie greets the learner as a <role>, asks which one they would like to present today, names both topics with "or", and asks them to select one.
  - key: prepare_line
    max_words: 55
    instruction: Ask them to take a minute to read the script, notice the gestures beside each line, stress the words in pink, and click Ready when prepared.
  - key: record_line
    max_words: 45
    instruction: Open with "It's time to become a <role>!", then keep the face visible in the camera; read with expressions, gestures and a clear, confident voice; click Record to begin and Stop when finished. End with "Good luck!"
  - key: transition_line
    max_words: 35
    instruction: Praise their recording, then tell them in one sentence what the lab notes say happens to it (leave this out only when there are no lab notes); a warm goodbye.
  - key: end_line
    max_words: 15
    instruction: One short closing line of praise.

# Computed by the generator (not AI):
#   topics[].prepare_stage, topics[].record_stage, topics[].last   (button_label and short_name come from the lab's content)
#   topics_spoken     "Cricket World Cup or Moon Mission"
#   stage_names       all stage names joined with " | "

assets:
  - { stage: select,     item: background, kind: reuse }
  - { stage: select,     item: button thumbnails, kind: library, content: "one picture per topic button (topics[].button_label; topics[].thumbnail describes it)" }
  - { stage: select,     item: click hint, kind: reuse }
  - { stage: prepare,    item: script card, kind: render, template: topic-script-card,
      content: "the topic's script lines; each with its gesture icon + caption; stress words in pink; '(your name)' after the name blank" }
  - { stage: record,     item: script card, kind: render, template: topic-script-card-small, content: "same script, compact, beside the camera frame" }
  - { stage: prepare,    item: background, kind: reuse }
  - { stage: record,     item: background, kind: reuse }
  - { stage: transition, item: background, kind: library }
  - { stage: end,        item: background, kind: library }
  - { stage: all,        item: character,  kind: reuse }
---

# Choose and record

The learner picks one of two topics, reads that topic's ready-made script (shown as a card with
gesture captions and pink stress words), then records it on camera, all in one activity. What happens
to the recording (for example a Creator Studio video) is up to the lab skill.

The script is part of the card image, not a `<view>` block, so it must be rendered (asset kind
`render`).

## Writing guidance

- Topics must be child-safe, current and non-partisan (see the global style skill). Both scripts follow
  the lab skill's script rules: an opening that names `theme.title`, a line introducing the learner
  (`Vangipurapu`, shown as `______ (your name)` on the card), the content, a closing.
- Each topic's `short_name` (lab content) keeps stage names short and distinct: 1–2 words, letters and digits only.
- No remediation in this activity: whatever the learner records is accepted.

## Bot prompt template

```
1. PERSONA — Curie (AI English Speaking Tutor)
Warm, patient, simple, encouraging. Never strict or academic.

CRITICAL: Generate exactly ONE <stage> + <speaker> + dialogue block per response, then STOP. Wait for actual student input before the next turn. Never chain multiple turns or stages in one response.

2. LOGIC FLOW

Stage: Select Topic
Curie: "<<slots.select_line>>"

Wait for the student's response, then move to <<#topics>>Stage: <<prepare_stage>> (if the student selected <<button_label>>)<<^last>> or <</last>><</topics>>.
<<#topics>>

Stage: <<prepare_stage>>
Curie: "<<slots.prepare_line>>"

Wait for the student to click Ready, then move to Stage: <<record_stage>>.
<</topics>>
<<#topics>>

Stage: <<record_stage>>
Curie: "<<slots.record_line>>"

Wait for the student's recording. There is no remediation in this activity — accept whatever was recorded, however complete or incomplete, or even silence, and move to Stage: Transition.
<</topics>>

Stage: Transition
Curie: "<<slots.transition_line>>"

Wait for the student's response. Accept any response, silence, gibberish or anything, then move to Stage: End.

Stage: End
<stage>End</stage>
<speaker>Curie</speaker>
<<slots.end_line>>

3. OUTPUT SCHEMA
<stage>STAGE NAME</stage>
<speaker>Curie</speaker>
DIALOGUE

Stage names: <<stage_names>>

Example:
<stage>Select Topic</stage>
<speaker>Curie</speaker>
<<slots.select_line>>

Start the activity. I'll be the student.
```

(`last` is set by the generator on the final topic.)

## Evaluation prompt

Global default.

## Validation

- Exactly 2 topics (the exemplar layout has two buttons).
- Each topic has a thumbnail, a script within the lab limits, and 4–8 keyword images in the studio template.
- `select_line` names both topics.
