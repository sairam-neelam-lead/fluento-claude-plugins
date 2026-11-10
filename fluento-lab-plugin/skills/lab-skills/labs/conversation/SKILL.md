---
id: conversation
kind: lab
version: 1

# What the author provides in the brief.
inputs:
  required:
    - format            # week_1 (see Formats)
    - topic             # what the learner talks about, e.g. "my best holiday", "my favourite festival", "a day at the park"
    - class             # Fluento level, e.g. "Level F"
  optional:
    - delta_unit        # curriculum unit, picked or typed
    - delta_topic       # picked or typed
    - learning_outcomes # Delta LOs; the speech's sentence patterns should practise them

# Activity blueprint per format. Week 1 is the first week of a conversation unit: the learner builds a
# short talk about the topic with Curie's help, then speaks about it unaided. That unaided talk is
# recorded as the unit's "before" video, compared later with the end-of-unit recording.
formats:
  week_1:
    activities:
      - { key: hook,          skill: intro-hook,  required: true }
      - { key: speech_prep,   skill: speech-prep, required: true, activity_fields: { is_assess: true },
          notes: "The next activity is the learner's last challenge of the day: speaking about the topic on their own." }
      - { key: pre_challenge, skill: free-talk,   required: true,
          activity_fields: { name: Pre-challenge, record_video_type: before },
          notes: "This is the last activity of the lab. Close the session warmly with a goodbye." }

defaults:
  character: Curie
  voice_speaker: Curie
  curie: default         # Curie's look on every stage: default or news_reporter

limits:
  questions: { min: 3, max: 4 }
  starters_per_question: { min: 1, max: 2 }
  script_lines: { min: 5, max: 10 }
  line_words: { max: 15 }
  challenge_points: { min: 2, max: 4 }
---

# Conversation lab

## Purpose

The learner talks about one everyday topic from their own life, in connected sentences, in order.
Curie asks a few questions; each answer becomes one sentence of a short personal talk, built from a
sentence starter ("During the holidays, I went to ____."). The learner then says the whole talk twice.
Finally they speak about the topic **on their own**, without the starters, and that is recorded.

The topic can be anything a child can tell from their own experience:

| Topic | Questions might cover | Sequence words |
|---|---|---|
| My best holiday | where, how they travelled, two things they did, how they felt | first, after that, finally |
| My favourite festival | which festival, how they get ready, what they eat, what they like most | before, on the day, in the evening |
| A day at the park | who they went with, what they played, what they saw | in the morning, then, at the end |
| My best friend | who, how they met, what they do together | — |
| My weekend | what they did on Saturday, on Sunday, the best part | on Saturday, on Sunday |

Speaking skills practised: speaking in full sentences, ordering events (beginning, middle, end), time
and sequence words, a steady pace with short pauses between sentences.

Typical length: 15 minutes.

## Formats

**week_1**: intro → speech prep → pre-challenge.

- **intro** (`intro-hook`): Curie greets the learner and says today they will talk about the topic.
- **speech prep** (`speech-prep`): 3–4 questions with sentence starters, then the learner says the
  whole talk twice (recorded). Assessed.
- **pre-challenge** (`free-talk`): the learner speaks 5–6 sentences about the topic on their own. This
  is the unit's "before" recording (`record_video_type: before`).

## The content

Step 1 (lab blueprint) writes the content once, in the shared shape every activity skill reads (see
skills/README.md).

```yaml
theme:
  role: storyteller                       # what the learner is today; one or two plain words
  title: my best holiday                  # the topic, as the learner would say it
  intro_line: "Today, you will tell me all about your best holiday."

questions:                                # 3–4, in the order Curie asks them; together they tell the topic in order
  - key: place                            # lowercase, letters and underscores
    stage_name: Destination               # one or two words, unique in the activity
    question: "Where did you go for your holidays?"
    starters: ["During the holidays, I went to ____."]
    show_options: false                   # false: no options on screen (the learner has their own answer)
    help_ideas: "nani's house, a family trip, a trip to the hills"   # ideas Curie offers in Hindi if the learner is stuck
  - key: travel
    stage_name: Travel
    question: "How did you travel to [place]?"   # [key] of an earlier question = the learner's own answer
    starters: ["I travelled to [place] by ____."]
    show_options: true                    # true: Curie shows 3 options that fit the learner's earlier answers
    help_ideas: "bus, train, car"
  - key: activity
    stage_name: Detail
    question: "What fun things did you do at [place]?"
    starters: ["During my stay, I ____.", "I also ____."]   # two starters: two details, asked one by one
    show_options: false
    help_ideas: "visited a new place, ate new food, played a game"

script:                                   # the talk the learner says, in order
  - text: "Hello everyone!"
  - text: "Today, I will tell you about my best holiday."
  - text: "During the holidays, I went to [place]."
  - text: "I travelled by [travel]."
  - text: "During my stay, I [activity]."
  - text: "I also [activity_2]."           # a second starter's answer is [<key>_2]
  - text: "I enjoyed my holiday very much!"
  - text: "Thank you!"

challenge:                                # the unaided talk in the pre-challenge
  lines: "5–6"
  points: ["where you went", "what you did", "how you felt"]
```

### Question rules

- The questions follow the order of the talk: beginning, middle, end.
- Each question is short, casual and about the learner's own life. Later questions may use an earlier
  answer as `[key]` ("How did you travel to [place]?").
- Each starter has exactly one blank `____` and is a full, correct sentence once filled. Use the time
  and sequence words from the learning outcomes in the starters when there are any.
- `show_options: true` only when a short list of options helps (how they travelled, who they went
  with). Never for the first question.
- `help_ideas`: 2–3 simple, India-relevant ideas, for when the learner is stuck.

### Script rules

- Opens by greeting the audience and naming the topic, and ends with a closing line ("Thank you!").
- Every starter's blank appears in exactly one line, as `[key]` (first starter) or `[key_2]` (second).
  The line may be shorter than the starter ("I travelled by [travel].").
- Lines without a blank are the same for every learner.
- Plain text only, no tags. At most 15 words per line; Level A–B: 10 words or fewer.

### Challenge rules

- `points`: 2–4 things to talk about, following the questions, said the way Curie would say them.
- `lines`: how many sentences to aim for; 5–6 by default, 3–4 for Level A–B.

## Lab-level fields

- **name:** "<Topic, title-cased> - Week 1", e.g. "My Best Holiday - Week 1". At most 60 characters.
- **desc:** 1–2 sentences: what the learner talks about and what they record.
- **goals:** one sentence, e.g. "Speak a short, sequentially ordered talk about a holiday."
- **report_card_summary:** one sentence per strand, about this topic:
  - Social_Emotional: confidence sharing a personal experience.
  - Cognitive: recalling and ordering events.
  - Linguistic: the sentence starters and time words of the talk.
  - Body_Voice: steady pace, pauses between sentences, clear voice.
- **delta_los:** from the brief, unchanged.

## Validation (lab level)

- 3–4 questions, unique keys and stage names; each has 1–2 starters with exactly one `____`.
- Every `[key]` in a question is an earlier question's key.
- Every blank (`[key]`, `[key_2]`) appears in exactly one script line, and the script uses no other.
- The pre-challenge is the last activity and has `record_video_type: before`.

## Production follow-ups (always flagged)

- A model talk video (another child talking about the topic), if the intro should show one.
