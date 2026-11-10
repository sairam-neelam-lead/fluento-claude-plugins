---
id: gesture-practice
kind: activity
version: 2
activity_type_id: "1"            # Introduction
activity_fields: { name: Interactive practice, record_video: true, duration: 7 }
# Reads: script, variables (from the activity named by the blueprint's `memory_from`).
base_flow: gesture-practice      # TTS tags include video and print; speech-to-text has gesture analysis on

# Only included when the brief provides `tutor_video`: one clip per stage, recorded by the content
# team, where a tutor says the line with its gesture and then pauses for the learner.
#   tutor_video:
#     - { line: 0, clip: <s3 key>, play_ms: 19000, retry_ms: 34000, ptt_secs: 7 }
#     - { line: 2, option: { weather: sunny, feeling: hot }, clip: <s3 key>, play_ms: 14000, retry_ms: 30000, ptt_secs: 9 }
requires: [tutor_video]

stages:
  - key: line
    repeat: practice_stages          # one per script line; lines with variables: one per allowed option combination
    name: "<<name>>"
    type: auto ptt
    ptt_timer: "<<ptt_secs>>"
    layout: gesture-practice.line   # full-screen video sprite (clip added per stage) + camera frame
  - key: end
    name: End
    type: auto ptt
    ptt_timer: 6
    layout: gesture-practice.end

slots:
  - key: line_stage_names
    instruction: One short, unique stage name (one word, letters only) per script line without a variable, e.g. Hello, Introduction, Thankyou, Wonderful.

# Computed by the generator (not AI):
#   memory_ref, memory_keys    as in script-recording
#   practice_stages            [{ name, expected, gesture, play_ms, retry_ms, ptt_secs, clip, next, route_into }]
#                              names for option stages: option words joined by "&", title-cased (Sunny&Hot)
#   stage_names                all stage names joined with " | "

assets:
  - { stage: line, item: video,  kind: production, content: "tutor clip for this line or option combination (from tutor_video)" }
  - { stage: line, item: camera, kind: reuse }
---

# Gesture practice

A tutor video plays and pauses after each script line. The learner repeats the line with its gesture
while the camera checks the gesture. Curie doesn't speak: the prompt only moves through the video.

A line passes on the first try when the spoken text matches and the required gesture is seen at least
once. Otherwise the video jumps to the retry point, the learner tries again, and the activity moves on
regardless.

Skip this activity when no tutor video exists. The generator never creates the clips.

## Rules

- `expected`: the script line with the learner's stored choices filled in. `Vangipurapu` lines accept
  any name ("don't check the name").
- `gesture`: the line's gesture from the script. A line with `gesture: none` checks speech only.
- Lines with variables get one stage per allowed combination, routed from memory, like the exemplar's
  weather + feeling stages.

## Bot prompt template

```
0. SESSION CONFIG
Student name: Vangipurapu | Regional language: Hindi

1. PERSONA — Curie (AI English Speaking Tutor)
Warm, patient, simple, encouraging. Never strict. India-relevant only.
Never introduce yourself — ongoing session.
Curie never speaks dialogue at any point in the flow.

2. MEMORY
Past memory: <<memory_ref>>
Retrieve <<memory_keys>> from the earlier script-building activity. Do not ask the student again — reuse the stored values directly.

3. ACTIVITY RULES
A video plays and pauses at key moments. At each pause the student says a specific sentence.
Every response must include <stage>STAGE_NAME</stage>. Output only what the schema specifies — no extra text.

Correct response → <stage>NEXT_STAGE</stage> <video>NEXT_TIMESTAMP</video>
Incorrect response → retry timestamp (defined per stage below), then move on regardless.

For all stages, the student response arrives as:
[spoken text]. gesture_summary: [gesture name]: N occurrence(s).

Correctness at the FIRST attempt of a stage requires BOTH:
1. The spoken text fully matches the Expected response.
2. gesture_summary shows the Required gesture with 1+ occurrence(s) (when a gesture is required).
If either fails → incorrect → go to the retry timestamp. On retry: take the response and move on regardless.

4. STAGES
<<#practice_stages>>

STAGE: <<name>> → <video><<play_ms>></video>
Expected: <<expected>>
<<#gesture>>Required gesture: <<gesture>> (1+)<</gesture>>
Correct → <<next>>.
Incorrect → <video><<retry_ms>></video> → wait for the student to respond, then accept any response (even incorrect or silence) and go to <<next>> regardless.
<</practice_stages>>

STAGE: End
<stage>End</stage>
<speaker>Curie</speaker>
Great job!

5. OUTPUT SCHEMA (all stages except End — no dialogue from Curie)
<stage>STAGE_NAME</stage>
<video>NEXT_TIMESTAMP</video>

Stage names: <<stage_names>>

Example:
<stage><<practice_stages.0.name>></stage>
<video><<practice_stages.0.play_ms>></video>
```

`next` is either a stage name or, when the next line branches, a routing rule written by the generator:
`stage based on [weather] and [feeling]: sunny + hot → Sunny&Hot | …`.

## Evaluation prompt

Global default.

## Validation

- Every stage has a clip, `play_ms` and `retry_ms` from `tutor_video`; otherwise the activity is dropped
  and flagged.
- Every required gesture is an existing gesture model.
