---
id: language-lesson
kind: lab
version: 2

# What the author provides in the brief.
inputs:
  required:
    - format            # teach (see Formats)
    - point             # the language point to teach, e.g. "good at vs good in", "a or an", "much or many", "is / am / are"
    - class             # Fluento level, e.g. "Level C"
  optional:
    - delta_unit        # curriculum unit, picked or typed
    - delta_topic       # picked or typed
    - learning_outcomes # Delta LOs; the rules and practice should serve them
    - source_material   # the textbook explanation or notes the lesson must stay true to

# Activity blueprint per format.
formats:
  teach:
    activities:
      - { key: hook,    skill: intro-hook,           required: true }
      - { key: lesson,  skill: explain-and-practise, required: true, activity_fields: { is_assess: true },
          notes: "The closing activity follows: no goodbye here." }
      - { key: closing, skill: closing,              required: true }

defaults:
  character: Curie
  voice_speaker: Curie
  curie: default         # Curie's look on every stage: default or news_reporter

limits:
  focus: { min: 1, max: 4 }
  rules: { min: 1, max: 3 }
  checks: { min: 2, max: 4 }
  options_per_check: { min: 2, max: 3 }
  uses: { min: 1, max: 2 }
  rule_words: { max: 20 }
  sentence_words: { max: 12 }
  why_words: { max: 15 }
---

# Language lesson

## Purpose

Curie teaches one small language point and the learner practises it until they can use it in their
own sentences. Any point a child can learn in one short sitting works: a pair of words that are often
mixed up, a pattern, a form.

| Point | Rules (one each) | A check | Use it |
|---|---|---|---|
| good at vs good in | good at + something you do (a game, a skill, a subject); good in + a place, a group or a situation | "Aman is good ___ singing." (at / in) | "What are you good at?" → "I am good at ____." |
| a or an | a before a consonant sound; an before a vowel sound | "I ate ___ apple." (a / an) | "What is in your bag?" → "I have a/an ____." |
| much or many | many for things you can count; much for things you can't | "How ___ pencils do you have?" | "What do you have many of?" |
| is / am / are | I am; he, she, it is; we, you, they are | "They ___ my friends." | "Tell me about your friend." → "My friend is ____." |

Speaking skills practised: noticing the pattern, choosing the right form, saying full sentences with it,
using it about yourself.

Typical length: 10 minutes.

## Formats

**teach**: intro → learn and practise → closing.

- **intro** (`intro-hook`): Curie greets the learner and says what they will learn today.
- **learn and practise** (`explain-and-practise`): each rule on screen with one example the learner says, check questions,
  then the learner's own sentences, and a recap. Assessed. Fixed stages (Opening, Learn, Check, My Turn,
  Recap, End): the rules, checks and uses are items inside Learn, Check and My Turn, so they need no stage
  names.
- **closing** (`closing`): Curie praises and says goodbye.

## The content

Step 1 (lab blueprint) writes the content once, in the shared shape every activity skill reads (see
skills/README.md).

```yaml
theme:
  role: learner                           # one or two plain words
  title: when to say good at and good in  # the point, as Curie would say it to a child
  intro_line: "Today, we will learn when to say good at and when to say good in."

focus: [good at, good in]                 # the words being taught: shown in pink wherever they appear

rules:                                    # 1–3, in the order Curie teaches them
  - key: good_at                          # lowercase, letters and underscores
    rule: "Say good at for something you can do, like a game or a skill."
    example: "I am good at drawing."      # one sentence: shown under the rule and said aloud by the learner
  - key: good_in
    rule: "Say good in for a place or a group, like a team or a class."
    example: "She is good in a team."

checks:                                   # 2–4 quick questions, mixed, never all the same answer
  - key: singing
    sentence: "Aman is good ____ singing."   # exactly one blank: ____
    options: [at, in]                     # 2–3; the answer is one of them
    answer: at
    why: "Singing is something you do."   # the reason, as Curie would say it

uses:                                     # 1–2: the learner's own sentences
  - key: talent
    question: "What are you good at?"
    starter: "I am good at ____."         # exactly one blank; uses a focus phrase
```

### Content rules

- **Be correct.** Teach standard English. When one form is common but not standard (for example
  "good in maths" for "good at maths"), teach the standard form and give the other form only where it is
  right. When the brief's point rests on a mistake, teach what is correct and say so in the report. When
  there is `source_material`, stay true to it.
- **Rules:** one idea each, in a child's words, with no grammar terms. Together they cover the point; the
  last rule may be the exception.
- **Example:** one per rule: a short, everyday, India-relevant sentence about children's lives, using a
  focus phrase. Level A–B: 6 words or fewer.
- **Checks:** each has exactly one right answer; mix the answers so guessing doesn't work; `why` is the
  reason in a child's words, matching the rule.
- **Uses:** a friendly question about the learner's own life and a starter that makes them use the point.
- **Focus:** the exact words being taught, as they appear in the sentences.

## Lab-level fields

- **name:** the point, title-cased, e.g. "Good At or Good In?". At most 60 characters.
- **desc:** 1–2 sentences: what the learner learns and practises.
- **goals:** one sentence on what the learner can do after the lesson.
- **report_card_summary:** one sentence per strand, about this point:
  - Social_Emotional: confidence trying a new pattern aloud.
  - Cognitive: noticing the pattern and choosing the right form.
  - Linguistic: the point itself, used in full sentences.
  - Body_Voice: clear pronunciation of the focus words.
- **delta_los:** from the brief, unchanged.

## Validation (lab level)

- Counts within `limits`; unique keys.
- Each rule has one example, and it contains a focus phrase.
- Each check's sentence has exactly one `____`; its answer is one of its options; the sentence with the
  answer filled in contains a focus phrase.
- Each use's starter has exactly one `____` and contains a focus phrase.

## Production follow-ups (always flagged)

- None by default.
