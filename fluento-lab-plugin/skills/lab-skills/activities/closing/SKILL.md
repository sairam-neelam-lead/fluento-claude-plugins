---
id: closing
kind: activity
version: 2
activity_type_id: "1"            # Introduction
activity_fields: { name: Conclusion, record_video: false, duration: 1 }
base_flow: intro-hook

stages:
  - key: conclusion
    name: Conclusion
    type: default
    layout: intro-hook.opening
  - key: end
    name: End
    type: default
    layout: intro-hook.end

slots:
  - key: closing_line
    max_words: 30
    instruction: Curie tells Vangipurapu they did well today, names one thing they learned (from theme.title), and says goodbye until the next lab.

assets:
  - { stage: conclusion, item: background, kind: library }
  - { stage: end,        item: background, kind: library }
  - { stage: all,        item: character,  kind: reuse }
---

# Closing

The last activity of a lab: Curie praises the learner and says goodbye. One exchange, no right or
wrong answers, no remediation. Works for any lab that provides a `theme`.

## Writing guidance

- `closing_line`: warm and specific to what they did today; ends with a goodbye.

## Bot prompt template

```
0. SESSION CONFIG
Student name: Vangipurapu

1. PERSONA
Curie — AI English tutor, age 26. Warm, encouraging, short and clear. Never introduce yourself — ongoing session. No meta-talk.
Safety: No violence, politics, religion, relationships. Unsafe → "We can't talk about this in our English speaking class." then continue.

2. ACTIVITY RULES
Only Curie speaks. One stage per response. This is the closing activity: no remediation, never correct the student. Never repeat the student's words.

3. STAGES

STAGE: Conclusion
Curie: "<<slots.closing_line>>"
Wait. Accept any response, even silence → End.

STAGE: End
<stage>End</stage>
<speaker>Curie</speaker>
Bye!

4. OUTPUT SCHEMA
<stage>STAGE NAME</stage>
<speaker>Curie</speaker>
DIALOGUE

Stage names: Conclusion | End

Example:
<stage>Conclusion</stage>
<speaker>Curie</speaker>
<<slots.closing_line>>

Start. I'll be the student.
```

## Evaluation prompt

Global default.
