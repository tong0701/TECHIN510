# Origins — Project Specification

---

## Project Overview

**Project Name:** Origins

**Proposer:** Daniel Zelinger (danzelphotos-tech)

**Developer:** _TBD — to be assigned via marketplace matching_

**Agreed Development Fee:** _TBD GIX Bucks (suggested range: 25–35)_

---

## Problem Statement

People forget their roots within two generations. Stories are lost to time, and most people cannot tell five detailed stories about their grandparents or other loved ones. There is no simple, guided tool that helps someone sit down and actually capture those memories before they are gone. Origins is a place to capture the memories of the people we love most and enable us to hear their stories in their own words.

## Desired Outcome

Origins prompts interview-style questions to users to help them share their life stories through audio recordings or text input. An AI interviewer adapts follow-up questions based on responses to draw out richer detail. The app then organizes a visual timeline of their lives, with photos pulled from uploads to accompany the stories.

---

## Tech Stack

**Preference:** Negotiable — open to developer's recommendation.

**Suggested options:**

| Option | Rationale |
|--------|-----------|
| **Next.js + Supabase** | Strong auth, real-time database, file storage for audio/photos, good AI integration story via API routes |
| **Python + Streamlit** | Faster prototyping, strong AI/ML ecosystem, simpler deployment |

Final stack decision will be recorded in `ARCHITECTURE.md` after developer is matched.

---

## AI Feature

**Required:** Yes

**Use cases:**
1. **AI Interviewer** — Generate contextual, follow-up interview questions that adapt based on previous answers to draw out deeper stories
2. **Story Organization** — Automatically extract dates, themes, and key events from recorded stories and organize them chronologically
3. **Timeline Generation** — Build a structured life timeline from unstructured narrative input, placing stories at the right point in a person's life

---

## Core Features & Scope

### In Scope (MVP)
- Audio recording capture with playback
- Text input as an alternative to audio
- AI-powered interview question generation
- Story storage and retrieval
- Photo upload to accompany stories
- AI-organized chronological timeline view
- Basic user authentication

### Out of Scope (Post-MVP)
- Video recording
- Real-time collaboration / multi-user editing
- Social media sharing integrations
- Mobile native app (web-responsive is sufficient)
- Speech-to-text transcription of audio (nice-to-have, not required for MVP)

---

## User Stories

### US-1: Account Creation
**As a** new user, **I want to** create an account with my email, **so that** my stories and data are saved securely and privately.

**Acceptance Criteria:**
- User can sign up with email and password
- User can log in and log out
- Unauthenticated users cannot access story data
- Password requirements are enforced (minimum 8 characters)

### US-2: Start an Interview Session
**As a** logged-in user, **I want to** start a new interview session for a loved one, **so that** I can begin capturing their life stories in an organized way.

**Acceptance Criteria:**
- User can create a new "person profile" (name, relationship, birth year)
- The AI interviewer presents an opening question appropriate to the person's context
- User can choose to respond via audio recording or text input
- Session state is preserved if the user navigates away

### US-3: Audio Recording
**As a** user in an interview session, **I want to** record my answer as audio, **so that** the story is captured in my own voice (or my loved one's voice).

**Acceptance Criteria:**
- Browser-based audio recording with start/stop/re-record controls
- Audio files are uploaded and stored securely
- Playback is available immediately after recording
- Recording works on desktop and mobile browsers
- Maximum recording length of 10 minutes per response with a clear indicator

### US-4: Text Input
**As a** user in an interview session, **I want to** type my answer as text, **so that** I can capture a story even when I cannot record audio.

**Acceptance Criteria:**
- Text area is available as an alternative to audio recording
- No character limit (but a soft guide of ~500 words displayed)
- User can edit text responses after saving
- Text and audio responses are stored equivalently in the system

### US-5: AI Follow-Up Questions
**As a** user answering interview questions, **I want** the AI to ask thoughtful follow-up questions based on what I just shared, **so that** I remember and share more detail than I would on my own.

**Acceptance Criteria:**
- After each response, the AI generates 1–2 follow-up questions referencing specifics from the user's answer
- User can skip a follow-up and move to a new topic
- The AI covers a range of life themes (childhood, career, relationships, milestones, traditions)
- Questions feel conversational and warm, not clinical

### US-6: Photo Upload
**As a** user, **I want to** upload photos and attach them to specific stories or time periods, **so that** the timeline is visually rich.

**Acceptance Criteria:**
- User can upload JPG/PNG images (max 10 MB each)
- Photos can be associated with a specific story or a date/time period
- Uploaded photos display as thumbnails in the timeline
- User can delete or replace uploaded photos

### US-7: AI-Organized Timeline
**As a** user who has recorded multiple stories, **I want** the app to organize my stories into a chronological timeline, **so that** I can see a loved one's life story unfold in order.

**Acceptance Criteria:**
- Stories are placed on a visual timeline based on dates/periods extracted by AI
- Timeline displays story titles, snippets, and associated photos
- User can manually adjust the placement of a story on the timeline
- Timeline is browsable by scrolling or clicking on time periods
- Stories without clear dates are grouped in an "Undated" section

### US-8: Story Browsing and Playback
**As a** user, **I want to** browse all captured stories for a person and play back audio recordings, **so that** I can revisit and enjoy the memories.

**Acceptance Criteria:**
- All stories for a person are listed and searchable
- Audio stories have a playback player with play/pause controls
- Text stories display in a readable format
- Stories can be filtered by theme or time period

---

## Data Model (Simplified)

| Table | Key Fields |
|-------|-----------|
| `users` | id, email, password_hash, created_at |
| `persons` | id, user_id, name, relationship, birth_year, photo_url |
| `stories` | id, person_id, question_text, response_text, audio_url, photo_urls, estimated_date, theme, order_index, created_at |

This model keeps scope to 2–3 tables as required. The developer may normalize further in `ARCHITECTURE.md`.

---

## Pages / Views (MVP)

1. **Landing / Auth Page** — Sign up, log in
2. **Dashboard** — List of person profiles the user has created; create new person
3. **Interview Session** — AI-driven Q&A interface with audio record and text input
4. **Timeline View** — Chronological visual timeline for a selected person with photos and story snippets
5. **Story Detail** — Full story view with audio playback and associated photos

---

## Scope Sanity Check

- [x] Can one person build this in ~40–60 hours using AI coding tools?
- [x] The core value can be demonstrated with 2–3 pages/views
- [x] The data model requires only 1–2 database tables (plus a users table)
- [x] Must-have feature in one sentence: **AI-powered interview prompts with audio/text capture organized into a visual life timeline**

---

## Contract Terms

- **Proposer** commits to reviewing PRs within 48 hours, providing specific and actionable feedback, and responding to developer questions within 48 hours.
- **Developer** commits to submitting at least one PR per 2-week period, responding to review comments within 48 hours, and keeping the proposer informed of blockers.
- The `SPEC.md` and agreed GIX Bucks fee constitute the project contract.

---

## Acceptance Gates

| Gate | Criteria | Target Date |
|------|----------|-------------|
| **Gate 1** | Project scaffolding, auth, and database schema deployed | Week 2 |
| **Gate 2** | Interview engine (AI questions + audio/text capture) working end-to-end | Week 4 |
| **Gate 3** | Timeline view with photo uploads and AI organization complete | Week 6 |
| **Final** | Polish, bug fixes, acceptance testing, demo-ready | Week 7–8 |
