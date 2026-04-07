# Architecture Document

## Overview

An AI-powered life story capture tool. AI asks interview questions, user records audio answers, audio gets transcribed and organized into a timeline with photos.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend + Backend | Streamlit | Fast to build, built-in audio recorder widget, simple deployment |
| Database | Supabase (PostgreSQL) | Free tier, built-in auth, storage for audio & photos |
| Speech-to-Text | OpenAI Whisper API | Best accuracy, simple integration |
| AI Interviewer | OpenAI GPT | Generates follow-up questions and summarizes stories |
| Deployment | Streamlit Cloud | One-click deploy from GitHub |

## Data Model

Two tables:

**stories**
| Column | Type | Note |
|--------|------|------|
| id | uuid (pk) | |
| subject_name | text | who the story is about |
| audio_url | text | Supabase storage path |
| transcript | text | Whisper output |
| summary | text | AI-generated |
| year_approx | int | for timeline ordering |
| ai_question | text | the prompt that triggered this |
| created_at | timestamp | |

**photos**
| Column | Type | Note |
|--------|------|------|
| id | uuid (pk) | |
| story_id | uuid (fk) | |
| image_url | text | Supabase storage path |
| caption | text | |

## Core Views

1. **Interview** — AI asks question → user records audio → transcribe → AI follows up
2. **Timeline** — Stories sorted by year, with transcripts and photos

## AI Plan

- Each recording: Whisper transcribes → GPT summarizes, extracts approximate year, generates next question
- Conversation history kept in `st.session_state` so questions don't repeat

## Agentic Development

- Use AI coding tools (Cursor/Claude) for scaffolding
- Prompts stored as plain text files for easy iteration

## Estimated Hours

| Task | Hours |
|------|-------|
| Supabase setup + schema | 3 |
| Interview page + audio recording | 8 |
| Whisper + AI pipeline | 6 |
| Timeline view | 5 |
| Photo upload | 3 |
| Polish + deploy | 3 |
| **Total** | **~28** |
