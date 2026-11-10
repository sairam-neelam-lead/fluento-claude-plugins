---
id: role-play-lab
kind: lab
version: 3

# What the author provides in the brief.
inputs:
  required:
    - format            # practice_and_play or practice_and_staged_play (see Formats)
    - situation         # the real-life exchange, e.g. "ordering food at a restaurant", "buying fruit at a shop", "buying a bus ticket"
    - class             # Fluento level, e.g. "Level D"
  optional:
    - partner           # a character from the Character library (Waiter, Shopkeeper, Coach…); picked from the situation if not given
    - delta_unit        # curriculum unit, picked or typed
    - delta_topic       # picked or typed
    - learning_outcomes # Delta LOs; the sentences and the confirm reply should practise them

# Activity blueprint per format.
formats:
  practice_and_play:
    activities:
      - { key: hook,      skill: intro-hook,     required: true }
      - { key: practice,  skill: choose-and-say, required: true,
          notes: "A role play follows, where the learner uses these sentences with the partner character." }
      - { key: role_play, skill: role-play,      required: true, activity_fields: { is_assess: true },
          notes: "The closing activity follows: no goodbye here." }
      - { key: closing,   skill: closing,        required: true }
    transitions: after the hook, kind production   # optional model video of children doing the role play, flagged
  practice_and_staged_play:
    activities:
      - { key: hook,      skill: intro-hook,       required: true }
      - { key: practice,  skill: choose-and-say,   required: true,
          notes: "A role play follows, where the learner uses these sentences with the partner character." }
      - { key: role_play, skill: staged-role-play, required: true, activity_fields: { is_assess: true },
          notes: "The closing activity follows: no goodbye here." }
      - { key: closing,   skill: closing,          required: true }
    transitions: after the hook, kind production

defaults:
  character: Curie
  voice_speaker: Curie
  curie: default         # Curie's look on every stage: default or news_reporter

limits:
  choices: { min: 1, max: 3 }
  options_per_choice: 3          # the choose layout has three buttons
  option_words: { max: 3 }
  sentence_words: { max: 10 }
  phases: { min: 2, max: 6 }     # practice_and_staged_play only
  line_words: { max: 30 }        # a phase's partner_line
  reply_words: { max: 10 }       # a phase's reply
---

# Role play lab

## Purpose

The learner practises one real-life exchange in English, then does it with a character. Curie first
lets them pick each thing they want (food, a drink, a ticket…) and say it in a polite target sentence.
Then a partner character from the Character library (a waiter, a shopkeeper…) has the conversation
with them, and Curie steps in only to help.

Any short, everyday exchange where the learner asks for things works:

| Situation | Learner | Partner (Character library) | Choices | Sentence |
|---|---|---|---|---|
| Ordering food | customer | Waiter | food, drink | "I would like [food], please." |
| Buying fruit | customer | Shopkeeper | fruit, how many | "Can I have [fruit], please?" |
| Joining a game | player | Coach | game, position | "I want to play [game]." |
| Planning an outing | child | Father | place, snack | "Can we go to [place]?" |

Speaking skills practised: complete request sentences, polite words (please, thank you), listening to a
question and answering what was asked, confirming.

Typical length: 10–15 minutes.

## Formats

**practice_and_play**: intro → choose and say → role play → closing. The role play is one short
exchange: greet, ask for each choice, confirm.

**practice_and_staged_play**: the same, but the role play (`staged-role-play`) is a whole conversation in
stages that the content's `phases` set out. Use it when the brief asks for a longer or "extended" role
play, or names the stages it wants.

- **intro** (`intro-hook`): Curie greets the learner and says what they will learn to do today.
- **choose and say** (`choose-and-say`): for each choice, click one of three options, then say it in
  the sentence.
- **role play** (`role-play`): the partner greets, asks for each choice, and confirms; Curie helps.
  Assessed.
- **closing** (`closing`): Curie praises and says goodbye.

## The content

Step 1 (lab blueprint) writes the content once, in the shared shape every activity skill reads (see
skills/README.md).

```yaml
theme:
  role: customer                          # who the learner plays
  title: ordering food at a restaurant    # what they learn to do, as Curie would say it
  setting: a restaurant
  intro_line: "Today, we will learn how to order food at a restaurant."

partner:
  character: Waiter                       # an existing Character library name (it has the picture and voice)
  avatar: waiter                          # optional: which of the character's avatars; the first one if left out
  voice: Ravi                             # a Character library name with a TTS voice; left out, partner.character's own voice
  role: a cheerful waiter                 # how the bot plays them

choices:                                  # 1–3, in the order the partner asks for them
  - key: food                             # lowercase, letters and underscores
    stage_name: Food                      # one word: stages "Choose Food", "Say Food"
    label: Food                           # heading on the board
    choose_question: "What would you like to eat?"     # Curie, in the practice
    partner_question: "What would you like to order?"  # the partner, in the role play
    options: [Aloo Paratha, Rajma Rice, Burger with Fries]
    sentence: "I would like [food], please."
    option_images:                        # one picture per option (asset kind: image)
      - { option: Aloo Paratha, image: "an aloo paratha on a plate, cartoon style" }
  - key: drink
    stage_name: Drink
    label: Drinks
    choose_question: "What would you like to drink?"
    partner_question: "And what would you like to drink?"
    options: [Orange Juice, Buttermilk, Cold Drink]
    sentence: "I would like [drink], please."

# practice_and_staged_play only: the conversation, one stage per phase, in order
phases:
  - key: greet                            # lowercase, letters and underscores
    stage_name: Greet                     # one or two words, unique: the stage's name
    type: talk                            # talk: the partner says partner_line, the learner gives reply
    partner_line: "…"
    reply: "…"
  - key: ask
    stage_name: Order
    type: choose                          # choose: the partner asks for these choices (their partner_question)
    choice_keys: [food, drink]
  - key: check
    stage_name: Confirm
    type: talk
    partner_line: "… [food] … [drink] …"  # [key]: the learner's choice, only after the phase that asks for it
    reply: "…"
```

The phases follow the situation; for example:

| Situation | Phases (type) |
|---|---|
| Ordering a meal | Greet (talk) → Order (choose) → Confirm (talk) → Finish (talk: "Here is your bill. How was the food?" → "It was very tasty, thank you!") |
| Buying at a shop | Greet (talk) → Ask (choose) → Pay (talk) → Goodbye (talk) |
| Booking a ticket | Greet (talk) → Destination (choose) → Time (choose) → Confirm (talk) |
| Seeing a doctor | Greet (talk) → Problem (choose) → Advice (talk) → Thank (talk) |

### Content rules

- **Partner:** an existing character from the Character library whose look fits the setting. Never
  Curie. `role` is a few words, no name.
- **Voice:** most picture characters have no voice of their own (the Waiter doesn't), so set `voice` to
  a character that has one (`context` lists `voices`), never Curie's. Without a voice the partner speaks
  in Curie's voice.
- **Choices:** what the learner has to ask for, in the order a real exchange goes. Options are short
  (1–3 words), easy to picture, India-relevant and clearly different.
- **Sentence:** one polite, complete request with `[key]` where the option goes. It must read naturally
  with every option. Keep the same pattern for every choice when it fits ("I would like …, please.").
- Level A–B: one or two choices and sentences of 6 words or fewer.
- **Phases (staged format):** the stages a real exchange goes through, in order, 2–6 of them. The first
  is a `talk` phase (the partner opens). Every choice is asked in exactly one `choose` phase. A line names
  a choice as `[key]` only after the phase that asks for it. Keep lines simple and natural: no amounts,
  totals or other details the learner has to work out. Replies are short, polite and complete ("Yes,
  that's correct.", not "Yes"); they are what Curie models if the learner gets stuck.

## Lab-level fields

- **name:** the situation, title-cased, e.g. "Let's Order Food". At most 60 characters.
- **desc:** 1–2 sentences: the exchange the learner practises and with whom.
- **goals:** one sentence on the speaking skills (complete, polite requests; answering what was asked).
- **report_card_summary:** one sentence per strand, about this situation:
  - Social_Emotional: confidence talking to someone in a real-life place.
  - Cognitive: listening to the question and answering what was asked.
  - Linguistic: the request sentence and polite words.
  - Body_Voice: clear pronunciation of the option words.
- **delta_los:** from the brief, unchanged.

## Validation (lab level)

- `partner.character` exists in the Character library (and `avatar`, when given, is one of its avatars).
- `partner.voice` (or the character itself) has a TTS voice, different from Curie's.
- 1–3 choices, unique keys and stage names; exactly 3 options each; each sentence contains `[key]`.
- The role play's `confirm_line` names every choice as `[key]` (practice_and_play).
- Staged: phases as in the content rules.

## Production follow-ups (always flagged)

- A picture for each option (the buttons show the option words until then).
- A model video of children doing the role play, if the intro should show one.
