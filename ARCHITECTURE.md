# Origins — Architecture Document

## Overview

An AI-powered life story capture tool. AI asks interview questions, users respond via audio recording or text input, and stories are organized into a browsable chronological timeline with photos.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend + Backend | Streamlit | Fast prototyping, built-in audio recorder & file upload widgets, minimal boilerplate |
| Database | Supabase (PostgreSQL) | Free tier, built-in auth (email/password), storage buckets for audio & photos |
| AI Interviewer | OpenAI GPT | Generates adaptive follow-up questions and extracts dates/themes from stories |
| Speech-to-Text | OpenAI Whisper API | Nice-to-have per SPEC; will integrate if time permits |
| Deployment | Streamlit Cloud | One-click deploy from GitHub |

## Data Model

Three tables, matching SPEC:

**users** (managed by Supabase Auth)
| Column | Type | Note |
|--------|------|------|
| id | uuid (pk) | Supabase auth.users |
| email | text | |
| created_at | timestamp | |

**persons**
| Column | Type | Note |
|--------|------|------|
| id | uuid (pk) | |
| user_id | uuid (fk → users) | |
| name | text | loved one's name |
| relationship | text | e.g. "grandmother" |
| birth_year | int | |
| photo_url | text | optional profile photo |
| created_at | timestamp | |

**stories**
| Column | Type | Note |
|--------|------|------|
| id | uuid (pk) | |
| person_id | uuid (fk → persons) | |
| question_text | text | AI-generated question |
| response_text | text | typed or transcribed answer |
| audio_url | text | Supabase storage path (nullable) |
| photo_urls | text[] | associated photos |
| estimated_date | text | AI-extracted, for timeline placement |
| theme | text | e.g. "childhood", "career" |
| order_index | int | manual ordering fallback |
| created_at | timestamp | |

## Pages (5 views)

1. **Auth Page** — Sign up / log in (Supabase Auth)
2. **Dashboard** — List of person profiles; create new person
3. **Interview Session** — AI asks question → user records audio or types text → AI follows up
4. **Timeline View** — Chronological timeline with story snippets and photos
5. **Story Detail** — Full story with audio playback and photos

## AI Plan

- **Question generation:** GPT receives person profile + previous stories → generates warm, contextual follow-up questions covering life themes (childhood, career, relationships, milestones, traditions)
- **Story organization:** After each response, GPT extracts estimated date, theme, and a short summary for timeline placement
- **Session state:** Conversation history kept in `st.session_state` to avoid repeat questions

## Agentic Development Plan

- Use Cursor + Claude for scaffolding pages, Supabase integration, and AI prompt iteration
- AI prompts stored as editable text files in `/prompts/` for easy tuning
- Supabase schema managed via SQL migrations in repo

## Development Timeline (per SPEC gates)

| Gate | Deliverable | Target |
|------|-------------|--------|
| Gate 1 | Auth + DB schema + app navigation | Week 2 |
| Gate 2 | Interview engine (AI questions + audio/text capture) end-to-end | Week 4 |
| Gate 3 | Timeline view + photo uploads + AI organization | Week 6 |
| Final | Polish, bug fixes, demo-ready | Week 7–8 |

## Estimated Hours

| Task | Hours |
|------|-------|
| Supabase setup + auth + schema | 5 |
| Dashboard + person profiles | 4 |
| Interview page (audio + text + AI) | 12 |
| Timeline view + AI organization | 10 |
| Photo upload + association | 4 |
| Story detail + playback | 3 |
| Polish + deploy | 4 |
| **Total** | **~42** |
