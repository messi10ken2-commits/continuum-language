# Continuum

A functional MVP prototype for a language-learning platform where human classes and AI self-study share one continuous learner memory.

## Included

- Learner and teacher views (toggle in the header)
- Shared CEFR skill profile and longitudinal learning memory
- AI-generated self-study recommendation based on class observations
- Recurring issue tracking with progress history
- Homework completion, streaks, and combined activity timeline
- Conversion path from free self-study to paid human lessons

## Run locally

```bash
npm install
npm run dev
```

## Production

```bash
npm install
npm run build
npm start
```

This prototype uses realistic demo data. A production version should connect authentication, PostgreSQL, lesson booking/payments, audio transcription, and a structured skill-event pipeline.
