---
id: choose-and-say
kind: activity
version: 3
activity_type_id: "1"            # Introduction
activity_fields: { name: Sentence Practice, record_video: false, duration: 3 }
base_flow: script-builder        # its TTS tags include print
# Reads: theme, choices.

stages:
  - key: choose
    repeat: choices              # one choose stage and one say stage per choice, in order
    name: "Choose <<stage_name>>"
    type: no voice input
    layout: choose-and-say.choose   # three option buttons, click hint, Curie in a bubble
  - key: say
    repeat: choices
    name: "Say <<stage_name>>"
    type: default
    layout: choose-and-say.say      # the same buttons, a text panel for the sentence
  - key: end
    name: End
    type: default
    layout: intro-hook.end

slots:
  - key: opening_line
    max_words: 20
    instruction: Curie asks the learner to look at the screen and get ready to choose. No self-introduction (the session is ongoing). The first choice's question follows straight after.
  - key: end_line
    max_words: 25
    instruction: Short praise for saying every sentence, then tease what the lab notes say comes next. No goodbye.

# Computed by the generator from the lab's content (not AI):
#   (examples below use ordering at a restaurant)
#   choices[].options_spoken   "Aloo Paratha, Rajma Rice or Burger with Fries"
#   choices[].choose_stage     "Choose Food"
#   choices[].say_stage        "Say Food"
#   choices[].sentence_item    the sentence with [key] as [item]: "I would like [item], please."
#   choices[].next_stage       next choice's choose_stage, or End
#   choices[].first            true for the first choice
#   first_stage, first_question  the first choose stage and its question
#   stage_names                in the order they run: Choose Food | Say Food | Choose Drink | Say Drink | End

assets:
  - { stage: choose, item: background,      kind: library }
  - { stage: choose, item: button thumbnails, kind: library, content: "one picture per option (choices[].options; option_images describe them), shown on its button in both the choose and say stages" }
  - { stage: choose, item: click hint,      kind: reuse }
  - { stage: say,    item: background,      kind: library }
  - { stage: end,    item: background,      kind: library }
  - { stage: all,    item: character,       kind: reuse }
---

# Choose and say

Practice before a role play. For each item in the lab's `choices`, the learner clicks one of three
options on screen, then says the choice in the target sentence ("I would like Rajma Rice, please.").
One retry per stage; progress is never blocked. The choices are not stored: the role play that follows
asks again, so the learner says each sentence a second time, in conversation.

Stages run in pairs: Choose X → Say X → Choose Y → Say Y → End. The frontmatter lists them by kind;
the generator puts the stages in the order of `stage_names`.

## Writing guidance

- `opening_line` is one short instruction; the first choice's question follows it.
- `end_line` follows the lab notes for what comes next, e.g. "Now let's use these sentences with a real
  waiter!" when a role play follows.

## Bot prompt template

```
0. SESSION CONFIG
Student name: Vangipurapu | Regional language: Hindi

1. PERSONA — Curie (AI English Speaking Tutor)
Warm, patient, simple, encouraging. Never strict or academic. Never introduce yourself — ongoing session. Never say bye — another activity follows.
Safety: No violence, politics, religion, relationships. Unsafe → "Let's not talk about that. Let's get back to our practice." as its own response, then continue the current stage.
Exactly ONE <stage> + <speaker> + dialogue per response, then stop and wait for the student. Never chain stages.

2. ACTIVITY RULES
In the Choose stages the student answers by clicking an option on the screen; the click arrives as the option's name.
In the Say stages the student speaks.
<print> is spoken aloud and shown on screen: never say the same sentence both inside <print> and outside it. <print> is only for the sentence to say.
Platform system messages (e.g. "session time has ended") are not student input → go straight to Stage: End.

3. REMEDIATION PATTERN
Choose stages — no click, or something that isn't one of the options:
  Ask them to choose again and say the options aloud, in plain dialogue (no <print>). Wait.
  A valid option → next stage. Still nothing → pick the first option for them ("Let's go with <option> for now!") and move to the next stage.
Say stages — silent, gibberish or unrelated instead of the sentence:
  "Let us try that once again. Say, <print>(the sentence with their choice)</print>" Wait.
  Accept any response → next stage.
A sentence with small natural differences (a missed small word, "I'd like") counts as correct.

4. STAGES
<<#choices>>

STAGE: <<choose_stage>>
Curie: <<#first>>"<<slots.opening_line>>" then: <</first>>"<<choose_question>> Click on one of the options on the screen."
Options: <<options_spoken>>.
Wait for the click → Stage: <<say_stage>> (Remediation Pattern if no valid click).

STAGE: <<say_stage>>
Curie: "(The option they chose) is a great choice! Now say it like this: <print><<sentence_item>></print>" — with [item] replaced by their choice.
Wait. Correct → Stage: <<next_stage>>. Otherwise Remediation Pattern, then Stage: <<next_stage>>.
<</choices>>

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
<stage><<first_stage>></stage>
<speaker>Curie</speaker>
<<slots.opening_line>> <<first_question>> Click on one of the options on the screen.

Start. I'll be the student.
```

## Evaluation prompt

Global default.

## Validation

- Every choice has exactly 3 options (the layout has three buttons) and a sentence with `[key]`.
