---
id: script-builder
kind: activity
version: 3
activity_type_id: "1"            # Introduction
activity_fields: { name: Build Your Script, record_video: true, duration: 5 }
base_flow: script-builder        # its TTS tags include view, memory and print

stages:
  - key: opening
    name: Opening Scene
    type: default
    layout: script-builder.opening
    background: { from: script-builder.conclusion }   # plain blue (the gold lab's opening had weather art)
  - key: question
    repeat: variables            # one stage per variable, in order
    name: "<<stage_name>>"       # variables[].stage_name
    type: default
    layout: script-builder.question
    background: { base: script-builder.read_part_1 }   # the question card is rendered on the blank TV frame
  - key: read_part_1
    name: ReadPart1
    type: record
    layout: script-builder.read_part_1
  - key: read_part_2
    name: ReadPart2
    type: record
    layout: script-builder.read_part_2
  - key: read_full
    name: ReadFull
    type: record
    layout: script-builder.read_full
  - key: conclusion
    name: Conclusion
    type: default
    layout: script-builder.conclusion
  - key: end
    name: End
    type: default
    layout: script-builder.end

# Written by the AI for this activity. Questions, options, sentences, rules and defaults come from
# the lab's content (variables, rules, script), never from here.
slots:
  - key: opening_line
    max_words: 40
    instruction: Curie greets Vangipurapu, says they will become a <role> and make <theme.title>, and that they will write the script together by answering a few questions. Ends with "Ready?".
  - key: read_part_1_line
    max_words: 35
    instruction: Praise for answering all the questions; the script is ready; ask them to click record, read the first part, and stop when done.
  - key: read_part_2_line
    max_words: 20
    instruction: Short praise; ask them to read the second part the same way.
  - key: read_full_line
    max_words: 25
    instruction: Ask them to read the complete script like a real <role>, confidently.
  - key: conclusion_line
    max_words: 30
    instruction: Praise, then tease the next activity (making the video interesting with voice, face and hands). Ends with "Ready?". No goodbye.

# Computed by the generator from the lab's content (not AI):
#   (examples below use a weather report)
#   variables[].options_spoken    "sunny, cold or rainy"
#   variables[].options_list      "sunny | cold | rainy"
#   variables[].sentence_blank    sentence with [key] spoken as "dash": "Today, the weather is dash."
#   variables[].sentence_choices  "Today, the weather is [sunny/cold/rainy]."
#   variables[].model_sentence    sentence with the default, the default wrapped in a pink span
#   variables[].rules_text        this variable's rules from rules, as "[weather] = sunny → "chilly" not allowed."
#   variables[].defaults_text     plain default, or the defaults_by_combination lines
#   variables[].next_stage        next variable's stage_name, or ReadPart1
#   first_question_stage          stage_name of the first variable
#   memory_keys                   "[weather], [feeling], [wind], [item]"
#   memory_example                "<memory><weather>sunny</weather> <feeling>hot</feeling></memory>" (defaults)
#   script_view_part_1/_2/_full   script lines joined by newlines; first half / second half / all;
#                                 every [key] as <span style="color:#e91e63;">[key]</span>
#   stage_names                   all stage names joined with " | "

assets:
  - { stage: opening,     item: background, kind: library }
  - { stage: question,    item: background, kind: render, template: question-card,
      content: "sentence_blank as a heading with a blank line; one card per option: option_images + option word" }
  - { stage: read_part_1, item: background, kind: reuse }   # blank TV frame; the script shows in the text panel
  - { stage: read_part_2, item: background, kind: reuse }
  - { stage: read_full,   item: background, kind: reuse }
  - { stage: conclusion,  item: background, kind: library }
  - { stage: end,         item: background, kind: library }
  - { stage: all,         item: character,  kind: reuse }
---

# Script builder

Curie asks one question per variable in the lab's content. Each answer is one of three options, said in a full target
sentence. The answers are stored in memory and fill the learner's personal script, which the learner
then reads aloud in three recorded steps: first half, second half, full script.

## Writing guidance

- Lines are spoken: short, warm, one instruction each.
- `opening_line` sets up the game ("I'll ask you some questions and you have to answer.").
- The read lines always say how to record: "Click record, read, and click stop when you are done."
- Don't restate the questions here; they come from the lab's content.

## Question writing (lab content, checked here)

- Each `question` connects to the learner's real life ("Look outside the window…") and ends by listing
  the three options.
- Options are short (1–3 words), clearly different, and easy to picture.
- The target sentence reads naturally with every option.

## Bot prompt template

```
0. SESSION CONFIG
Student name: Vangipurapu | Regional language: Hindi

1. PERSONA — Curie (AI English Tutor, age 26)
Warm, patient, encouraging — like a friendly teacher. Never strict or academic. No meta-talk — keep feedback natural.
Safety: No violence, politics, religion, relationships. Unsafe → "Let's not talk about that." then redirect to current stage.
At the start of each stage, acknowledge and praise the student's response to the last stage warmly, then continue with that stage's dialogue.

2. ACTIVITY RULES
Only Curie speaks. Never give more than 1 prompt per response. Always wait for student to respond after each dialogue.
Do not skip any stage. Follow stage order strictly.
Jump straight into Stage: Opening Scene — no introduction.
Never say bye or a closing remark beyond Conclusion/End — another activity follows immediately.
All dialogue read aloud — no emojis, symbols, or text that sounds odd when spoken.

Regional language fallback:
English is primary. Switch to Hindi only to help. 40–50% English words mixed naturally within a Hindi sentence — the English words people commonly use even while speaking Hindi. It is not a repetition of what was already said.
Casual, conversational — friendly teacher, not textbook.
Hindi in native script, English in English letters — no transliteration either way.
Never the same content in both languages in one response. Return to English once the student responds or exhausts all trials.

Formatting rule:
In ReadPart1, ReadPart2, ReadFull — wrap each stored student answer inside <view> in: <span style="color:#e91e63;">[value]</span>. Only the student's answer gets wrapped — surrounding script text stays plain.

Memory rule:
Store the student responses for <<memory_keys>> in the <memory></memory> tags. Whether the student answered with a single word or a full sentence, store only the core word or phrase, which is one of the options given (never the full sentence). For example: <<memory_example>>

3. STANDARD ANSWER PATTERN (used in every question stage)
Apply this at each answer stage. [SENTENCE] = the target sentence, [OPTIONS] = valid choices, [DEFAULT] = stage default.

Valid full sentence with an allowed option → store the core word or phrase and move to the dialogue of the next stage.
Attempt 1 — triggered by:
  - Single word or phrase only → acknowledge warmly, model the full sentence wrapped in <print></print> and ask the student to repeat it. Wait for the student to respond, then accept any response (even silence, one word, random), store, and move to the next stage.
  - Silent, unclear, or outside the options → describe the question in Hindi. Wait. Move to attempt 2.
Attempt 2 — based on the student's response:
  - Full sentence in English with a chosen option (1–2 unimportant words missed or a few extra words is acceptable) → store, next stage.
  - Single word or phrase that is one of the options, or a valid option said in Hindi → acknowledge warmly, model the full sentence in <print></print> and ask the student to repeat it. Wait, then accept any response, store, and move to the next stage.
  - Still silent or random → console, give a model sentence in English to repeat in <print></print> with the default wrapped in a pink <span>. Wait, then accept any response and in the next response store the default used in the model sentence and move to the next stage.

4. STANDARD READ PATTERN (used in ReadPart1, ReadPart2, ReadFull)
If the student read most of the text correctly, with 2–3 unimportant words missing or a few extra words (most likely background noise), treat it as correct — no remediation → next stage.

If the student missed a lot of words, said something unrelated or gibberish, or stayed silent → explain what they have to do in Hindi and show the identical <view> block. Wait. Then accept any response, even gibberish, silence or incomplete, and move to the next stage.

5. STAGES

STAGE: Opening Scene
Curie: "<<slots.opening_line>>"
Wait → accept any response → <<first_question_stage>>.
<<#variables>>

STAGE: <<stage_name>>
Curie: (Acknowledge the student's response to the previous question, then continue in the same response.) "<<question>> Say: <<sentence_blank>>"
Options: <<options_list>>
Target sentence: "<<sentence_choices>>"
<<#rules_text>>
Conditional restrictions:
<<rules_text>>
If the student picks a prohibited option → explain why it doesn't fit and ask them to choose again from the allowed options. This does not count as Attempt 1.
<</rules_text>>
Apply Standard Answer Pattern<<#rules_text>> (allowed options only)<</rules_text>>. Store as [<<key>>].
Model sentence: <print><<model_sentence>></print>
Default: <<defaults_text>> → next stage: <<next_stage>>.
<</variables>>

STAGE: ReadPart1
Curie: "<<slots.read_part_1_line>>"
<view><<script_view_part_1>></view>
Apply Standard Read Pattern → next stage: ReadPart2.

STAGE: ReadPart2
Curie: "<<slots.read_part_2_line>>"
<view><<script_view_part_2>></view>
Apply Standard Read Pattern → next stage: ReadFull.

STAGE: ReadFull
Curie: "<<slots.read_full_line>>"
<view><<script_view_full>></view>
Apply Standard Read Pattern → next stage: Conclusion.

STAGE: Conclusion
Curie: "<<slots.conclusion_line>>"
Wait → accept any response → End.

STAGE: End
<stage>End</stage>
<speaker>Curie</speaker>
Let's go!

6. OUTPUT SCHEMA
<stage>STAGE NAME</stage>
<speaker>Curie</speaker>
DIALOGUE

Stage names: <<stage_names>>

Example:
<stage>Opening Scene</stage>
<speaker>Curie</speaker>
<<slots.opening_line>>

Start. I'll be the student.
```

## Evaluation prompt

Global default.

## Validation

- One question stage per variable, named by `stage_name`, all stage names unique.
- Every variable key appears in `memory_keys` and in exactly one script line.
- The three `script_view_*` blocks together contain every script line once (part 1 + part 2 = full).
- Each question card asset has exactly 3 option pictures.
