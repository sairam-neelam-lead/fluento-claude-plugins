---
id: creator-studio
kind: lab
version: 4

# What the author provides in the brief.
inputs:
  required:
    - format            # guided | topic (see Formats)
    - show_idea         # what the learner presents, e.g. "a recipe for my favourite snack", "a book review", "a weather report"
    - class             # Fluento level, e.g. "Level B"
    - video_template_id # base studio template for the final video (see Studio template)
  optional:
    - delta_unit        # curriculum unit, picked or typed; its name appears in the final video (topic token)
    - delta_topic       # picked or typed
    - learning_outcomes # Delta LOs
    - source_material   # article or notes the script must stay true to
    - tutor_video       # enables gesture-practice: video file + per-line timestamps

# Activity blueprint per format. Activity skills are generic; everything Creator Studio-specific is set
# here, per entry:
#   activity_fields  merged over the activity skill's own fields (e.g. the Creator Studio flags)
#   video_template   required → the activity is linked to the brief's studio template
#   notes            told to the AI writing the activity's lines (e.g. what happens to the recording)
#   memory_from      key of the activity whose stored choices this one reads
creator_studio_recording: &cs_recording
  activity_fields: { is_creator_studio: true, record_video_type: creator_studio }
  video_template: required
  notes: "This recording becomes the learner's Creator Studio video. It will be ready soon and sent to their family's WhatsApp number."

formats:
  guided:
    activities:
      - { key: hook,             skill: intro-hook,       required: true }
      - { key: script_builder,   skill: script-builder,   required: true }
      - { key: gesture_practice, skill: gesture-practice, required: false, include_when: tutor_video, memory_from: script_builder }
      - { key: speech_practice,  skill: script-recording, required: false, mode: practice, memory_from: script_builder,
          notes: "A final recording follows this practice." }
      - { key: final_recording,  skill: script-recording, required: true,  mode: final, memory_from: script_builder, <<: *cs_recording }
    transitions: between every pair of activities, kind production   # optional, flagged
  topic:
    activities:
      - { key: topic_show, skill: choose-and-record, required: true, <<: *cs_recording }
    transitions: before the first activity, kind production          # optional, flagged

defaults:
  character: Curie
  voice_speaker: Curie
  curie: news_reporter   # Curie's look on every stage: news_reporter (presenter suit) or default
  # The Creator Studio activity's speech-to-text must keep word-level timestamps (keyword images are
  # timed from them). The script-recording.final and choose-and-record base flows already do.

# The activity skills' layouts, base flows and images come from the shared snapshot in skills/assets
# (see its sources.yaml). Nothing is read from the gold labs at generation time.

limits:
  script_lines: { min: 4, max: 8 }
  script_words: { max: 75 }
  line_words: { max: 15 }
  variables: { min: 2, max: 4 }      # guided only
  options_per_variable: 3
  option_words: { max: 3 }
  topics: { min: 2, max: 2 }          # topic only; the topic.select layout has two buttons
---

# Creator Studio lab

## Purpose

The learner records a short video of themselves presenting something, 30–60 seconds long. Creator
Studio turns the recording into a branded video, with pictures that pop up as they say key words, and
sends it to the learner's family on WhatsApp.

The show can be **anything a child can present to camera**. The show idea in the brief decides the
genre; nothing in this skill assumes news or weather.

| Genre | Learner's role | Typical opening | Typical closing |
|---|---|---|---|
| Report (news, weather, sports, school event) | reporter | "Hello, everyone! Welcome to today's school news." | "That's all for today. Thank you for watching!" |
| How-to / recipe | chef, maker | "Hi friends! Today I will show you how to make lemonade." | "Try it at home and enjoy!" |
| Story | storyteller | "Hello! Here is my story about a clever crow." | "And that is the end of my story. Thank you!" |
| Poem or rhyme | poet | "Hello! My poem is called Rain, Rain." | "Thank you for listening!" |
| Review (book, film, game) | reviewer | "Hi! Today I am reviewing my favourite book." | "I give it five stars. Bye!" |
| Tour / guide | tour guide | "Welcome to my town! I am your guide today." | "Come and visit soon!" |
| Advert | presenter | "Hello! Have you tried our tasty mango juice?" | "Buy it today!" |
| About me / my family / my pet | myself | "Hi, everyone! Let me tell you about my pet." | "Thank you for watching!" |

Speaking skills practised in every genre: presenting to an audience, confident voice, stressing key
words, matching gestures to words, reading a script fluently.

Typical length: 15–20 minutes (guided), 5 minutes (topic).

## Formats

**guided** (layouts snapshotted from gold lab 133, Weather reporting). The learner builds a *personal* script by answering 2–4
questions, each with 3 options. Their choices are stored in memory and fill the script in every later
activity. Activities: hook → script builder → (gesture practice) → (speech practice) → final recording.
Use this when the learner can make the content their own: my favourite food, my pet, my weekend, the
weather today, a recipe with my choice of fruit.

**topic** (layouts snapshotted from gold lab 107, News Report). The learner picks one of 2 ready-made scripts, reads it and
records it, all in one activity. Use this when the content is fixed facts or text: two news stories,
two short poems, two science facts, two folk tales.

## The content (show bible)

Step 1 (lab blueprint) writes the content once, in the shared shape every activity skill reads (see skills/README.md). Every activity reads it, and the final video
template is built from it, so the script the learner says and the pictures that pop up always match.

```yaml
theme:
  role: chef                              # what the learner plays, from the genre table
  title: my fruit salad recipe            # how line 1 names the video; also the video headline
  setting: Miss Curie's kitchen           # optional: where the learner is, if the genre has one
  intro_line: "You will become a chef and show everyone how to make your own fruit salad."

# guided format
variables:                                # 2–4, in the order Curie asks them
  - key: fruit                            # memory key: lowercase, letters and underscores
    stage_name: Fruit                     # one or two words, unique in the activity
    question: "Which fruit do you like most? Mango, banana or apple?"
    sentence: "First, I cut a [fruit]."   # the target sentence the learner says
    options: [mango, banana, apple]
    default: mango
    option_images:                        # one picture per option (asset kind: image)
      - { option: mango, image: "a ripe mango on a plate, cartoon style" }
  # …
rules:                                    # options that can't go together
  - { when_key: fruit, when_value: banana, not_allowed_key: topping, not_allowed: [lemon juice] }

# topic format
topics:                                   # exactly 2
  - key: crow
    button_label: The Clever Crow         # 1–4 words
    short_name: Crow                      # 1–2 words, used in stage names
    thumbnail: "a crow dropping pebbles into a pot, cartoon style"
    script: [ …lines, below… ]

script:                                   # guided: one script; topic: one per topic
  - text: "Hi friends! Today I will show you my fruit salad recipe."
    gesture: Wave                         # an existing gesture model name (see Gestures), or none
    gesture_caption: "Wave and smile."    # 2–5 words shown beside the line
    stress: [fruit salad]                 # 1–3 words shown in pink and stressed
  - text: "My name is Vangipurapu, and this is Miss Curie's kitchen."
    gesture: Myself
    gesture_caption: "Point to yourself."
  - text: "First, I cut a [fruit]."
    gesture: none
    gesture_caption: "Pretend to cut."
  # …

keyword_images:                           # pictures that pop up in the final video
  - { keywords: [mango], image: "a ripe mango on a plate, cartoon style" }
```

A second example, the gold lab's weather report: role `weather reporter`, title `today's weather
report`, setting `Miss Curie's newsroom`, variables `weather` (sunny / cold / rainy), `feeling`, `wind`,
`item`, line 1 "Hello, everyone! Welcome to today's weather report."

### Script rules

- **Line 1 opens the video and names it with `theme.title`**, in the style of the genre (see the genre
  table). The video's headline is the first 12 words the learner says.
- **An early line introduces the learner** with the literal name `Vangipurapu` (replaced at runtime
  with the learner's name).
- **The last line closes the video** in the genre's style.
- **Guided:** each variable appears in exactly one line, as `[key]`, and that line reads naturally with
  every allowed option. Lines without a variable are the same for every learner.
- **Topic:** each topic's script is 4–8 lines, factually correct, child-safe, and stays true to the
  source material when there is any. No disputed claims, no names of private people.
- **Stress words:** 1–3 per line: the show's key nouns, the learner's choices, an emotional word.
- **Plain text:** no HTML or tags in script lines; highlighting is added where the script is shown.
- **Language:** Level A–B: lines of 10 words or fewer and present tense only. Level C–E: up to 15 words.

### Gestures

Each line gets at most one gesture, and only from the gesture models that already exist, because the
gesture-practice activity checks them on camera. Generic ones work for any show:

`Wave` (hello, bye) · `Myself` (introducing yourself) · `Salute` (thank you) · `Point` · `Happy` ·
`Hand movements` · `Hold high` · `Actions` · `Imagine`

Other existing models belong to particular labs (weather: `Hot`, `Cold`, `Nice&Cool`, `Sunglasses`,
`Sweater`, `Umbrella`, `Strongwind`, `Littlewind`, `Nowind`; others: `Eat`, `Read`, `Write`, `Sing`,
`Play`, `Run`, `Sleep`…). Use one only when the line really is about it. For any other action write
`gesture: none` and put the action in the caption only ("Pretend to stir the bowl."). The caption still
appears beside the line; it just isn't checked.

Prefer gestures that don't depend on a learner's choice. A gesture that changes with an option forces
the recording activity to branch (see `script-recording`).

### Keyword image rules

- One picture per option, keyed by the option word itself (guided), or 4–8 pictures keyed by the
  script's key nouns (topic).
- An option keyword must not also appear in the script's fixed text; any other keyword must appear,
  word for word, in exactly one script line.
- Keywords must be distinctive. Never a common word like "no", "a", "is" or "today".
- Plus the base template's `default` picture (the idle screen).

## Lab-level fields

- **name:** "<Show title, title-cased> – Creator Studio", e.g. "My Fruit Salad Recipe – Creator Studio".
  At most 60 characters.
- **desc:** 1–2 sentences: the learner's role and what they record.
- **goals:** 1–2 sentences on the speaking skills (presenting, stress, gestures, confident voice).
- **report_card_summary:** one sentence per strand, about this show:
  - Social_Emotional: confidence presenting to an audience.
  - Cognitive: choosing and organising information for the script.
  - Linguistic: the sentence patterns and vocabulary of the script.
  - Body_Voice: gestures, facial expression, eye contact, voice.
- **delta_los:** from the brief, unchanged.

## Studio template

The final video is built on a base **studio template** (a template from the admin panel's Video
Templates page; `video_template_id` in the brief): its intro and outro clips, the background behind
the learner, overlays and the idle screen. The author picks it in the brief from the environment's
studio templates (there is no default id, since template ids differ between environments). In dev,
template 5 has a **newsroom look** (studio background, news-style intro, weather and breaking-news
overlays) that suits reports only; for any other genre pick a template with a matching or neutral
look, or have one designed. The generated lab is always flagged to check this.

The generator links the chosen template as it is from the final activity's
`creator_studio_template_id`. It never creates, copies or changes a template: one template is
shared by many labs, so its keyword pictures stay as they are. This lab's `keyword_images` are listed
for the author, who decides whether the template needs them.

## Memory wiring (guided)

The script builder stores the learner's choices; the activities with `memory_from: script_builder` read
them with `{{ memory.activity(<the script builder's activity id>) }}`, filled in at generation.

## Platform prerequisites

| # | Change | Why |
|---|---|---|
| 1 | A neutral base studio template | The only complete one in dev (5) looks like a newsroom |

## Validation (lab level)

- Exactly one activity has `is_creator_studio: true`, and it is the last one.
- Guided: every variable is stored by the script builder and read by every later activity; every
  `[key]` in the script is a declared variable.
- Line 1 contains `theme.title`; a line contains `Vangipurapu`.
- Keywords follow the keyword image rules; gestures are existing model names or `none`.
- Script, lines, variables and options are within `limits`.
- Without a unit the video's topic line is empty: flagged, not blocking.

## Production follow-ups (always flagged)

- Transition videos between activities.
- The tutor video for gesture practice, if that activity is wanted but no video was given.
- Pictures: option pictures, topic thumbnails and keyword pictures.
- A studio template whose look fits the show, if the default newsroom template doesn't.
