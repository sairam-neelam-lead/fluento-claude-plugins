---
id: script-recording
kind: activity
version: 4
activity_type_id: "1"            # Introduction

# The lab blueprint picks the mode, and adds anything lab-specific (e.g. Creator Studio flags, a video
# template, `notes` on what happens to the recording). Everything not listed under a mode is shared.
# Reads: theme, script, variables (from the activity named by the blueprint's `memory_from`).
modes:
  practice:
    activity_fields: { name: Speech Practice, record_video: true, duration: 2 }
    base_flow: script-recording.practice
  final:
    activity_fields: { name: Final Recording, record_video: true, duration: 2 }
    base_flow: script-recording.final   # speech-to-text keeps word-level timestamps + gesture analysis


stages:
  - key: opening
    name: Opening
    type: no voice input
    layout: script-recording.opening   # plain blue, camera preview + Ready button
  - key: record
    repeat: record_stages            # one stage, or one per gesture combination (see Branching)
    name: "<<name>>"
    type: record
    layout: script-recording.record    # the background is the rendered cue panel
  - key: end
    name: End
    type: default
    layout: script-recording.end
    background: { from: script-recording.opening }   # plain blue (the gold lab's end was a newsroom)

slots:
  - key: opening_line
    max_words: 35
    instruction: >
      practice: ask Vangipurapu if they are ready to practise the full script, remind them to keep their
      face visible in the camera, and to click the Ready button.
      final: tell Vangipurapu it's time to record <theme.title> for real, remind them to keep their face
      visible, ask if they are ready, and to click the Ready button.
  - key: record_line
    max_words: 35
    instruction: Ask them to speak in an energetic voice and do the actions shown on the left like a good <role>; click record when ready and stop when finished. Ends with "All the best."
  - key: end_line
    max_words: 30
    instruction: >
      practice: praise the practice; no goodbye (the final recording follows).
      final: praise their <theme.title>, then tell them in one sentence what the lab notes say happens to the recording (leave this out only when there are no lab notes). A short goodbye is fine.

# Computed by the generator (not AI):
#   memory_ref        "{{ memory.activity(<id of the blueprint's memory_from activity>) }}"
#   memory_keys       "[weather], [feeling], [wind], [item]"   (weather report example)
#   script_view       the full script as one <view> body: lines joined by "\n\n" per paragraph,
#                     [key] and every script[].stress word wrapped in <span style="color:#e91e63;">…</span>
#   stress_list       the stressed words and [keys], quoted, comma-separated, for the formatting rule
#   record_stages     [{ name, route }]: see Branching
#   single_record_stage  true when record_stages has one entry
#   first_record_stage   record_stages[0].name
#   stage_names       all stage names joined with " | ", including Opening and End

assets:
  - { stage: opening, item: background, kind: library }
  - { stage: record,  item: background, kind: render, template: guided-script-card,
      content: "a 'YOUR SCRIPT' panel with the gesture caption for each script line" }
  - { stage: end,     item: background, kind: library }
  - { stage: all,     item: character,  kind: reuse }
---

# Script recording

The learner records their full personal script, reading it from the on-screen panel while doing the
gesture shown beside each line. Run it twice: `practice` mode first, then `final` mode, the recording
that counts. What happens to the final recording (for example a Creator Studio video) is up to the lab
skill: it sets the activity flags and passes `notes` for Curie to mention.

## Branching

The script panel's background shows a gesture icon beside each line. If every line's gesture is the
same for all learners, there is **one record stage, named `Record`**, and Opening goes straight to it.

If some lines' gestures depend on a learner's choice (e.g. `Hot` vs `Nice&Cool`), each combination
needs its own background, so there is one record stage per combination of those variables:

- At most 2 variables may drive branching (at most 9 stages). If more would, fall back to one stage
  and drop the choice-dependent gestures from the icons (keep them in the captions).
- Stage name: the option words joined by `&`, title-cased, each shortened to one word, e.g.
  `Hot&Strong`, `NiceCool&No`. Unique.
- `route`: `[feeling] = hot and [wind] = a strong`.

Only combinations allowed by the content's `rules` get a stage.

The exemplar prompts have mismatched stage names ("cold&Strong" vs "Cold&Strong"; "Opening" and "End"
missing from the stage list). Generated prompts don't, because every name is written once from
`record_stages`.

## Bot prompt template

```
0. SESSION CONFIG
Student name: Vangipurapu | Regional language: Hindi

Past memory: <<memory_ref>>
Retrieve <<memory_keys>> from the earlier script-building activity. Do not ask again — reuse directly.

1. PERSONA — Curie (AI English Tutor, age 26)
Warm, patient, encouraging — like a friendly teacher. Never strict or academic. No meta-talk.
Safety: No violence, politics, religion, relationships. Unsafe → "Let's get back to our activity." then redirect to current stage.

2. ACTIVITY RULES
Only Curie speaks. Never give more than 1 prompt per response. Always wait for student to respond after each dialogue.
Do not skip any stage. Follow stage order strictly.
All dialogue read aloud — no emojis, symbols, or text that sounds odd when spoken.
The first message "Hello" at conversation start is system-generated — do not count it as a student response.

Formatting rule:
Inside <view> blocks, wrap the following in <span style="color:#e91e63;">word</span> (pink): <<stress_list>>.
Only the specific word or phrase is wrapped — surrounding text stays plain.
<span> tags are permitted inside <view> blocks only.

3. STANDARD READ PATTERN (used in every record stage)
Curie: "<<slots.record_line>>"

Show this <view> block (fill in the stored values, apply pink highlights):
<view><<script_view>></view>

Wait for the student to respond.
If the student said the expected sentences (a few words missing, mispronounced, or a few extra words, mostly background noise, are acceptable) → accept as read aloud, no judging, no remediation → Stage: End.
If the student was silent, missed a lot of the expected words, or gave an unrelated or gibberish response → nudge in Hindi to record again and include the identical <view> block. Wait. Then accept any response, even silence or gibberish, and move to Stage: End.

4. STAGES

STAGE: Opening
Curie: "<<slots.opening_line>>"
Wait → accept any response → <<#single_record_stage>>Stage: <<first_record_stage>>.<</single_record_stage>><<^single_record_stage>>route based on the stored values:
<<#record_stages>>
<<route>> → STAGE: <<name>>
<</record_stages>>
<</single_record_stage>>
<<#record_stages>>

STAGE: <<name>>
Apply Standard Read Pattern → Stage: End.
<</record_stages>>

STAGE: End
<stage>End</stage>
<speaker>Curie</speaker>
<<slots.end_line>>

5. OUTPUT SCHEMA
<stage>STAGE NAME</stage>
<speaker>Curie</speaker>
DIALOGUE

Stage names: <<stage_names>>

Example:
<stage>Opening</stage>
<speaker>Curie</speaker>
<<slots.opening_line>>

Start. I'll be the student.
```

## Evaluation prompt

Global default.

## Validation

- `final` mode: the base flow's speech-to-text has `speechAnalysisOptions.wordLevelTimestamp: true`
  (word timings, used e.g. by Creator Studio keyword pictures).
- Every record stage has a route (when branching) and a rendered background.
- `script_view` contains every script line, with every `[key]` from memory.
