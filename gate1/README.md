# Gate 1 — Origins app (Streamlit scaffold)

This directory is the **Check-in 1 / Gate 1** milestone: the Origins **Streamlit** app (auth, multi-page shell, theme). The **product** is still **Origins**; the repo root describes the full project.

AI-powered life story capture: an interviewer asks questions, you respond with audio or text, and stories are organized into a chronological timeline with photos.

**Stack:** Streamlit · Supabase (Auth, Postgres, Storage) · OpenAI API

## Prerequisites

- Python 3.10+ recommended
- A [Supabase](https://supabase.com) project with Auth enabled (email/password)
- An [OpenAI](https://platform.openai.com) API key (for future interview features)

## Database

Supabase should define at least:

- `persons` — `id`, `user_id`, `name`, `relationship`, `birth_year`, `photo_url`, `created_at`
- `stories` — `id`, `person_id`, `question_text`, `response_text`, `audio_url`, `photo_urls`, `estimated_date`, `theme`, `order_index`, `created_at`

Users are managed by Supabase Auth (`auth.users`).

## Setup

1. **Clone the repo** and open this directory:

   ```bash
   cd gate1
   ```

2. **Create a virtual environment** (recommended):

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:

   - `SUPABASE_URL` — Project URL (Settings → API)
   - `SUPABASE_KEY` — anon/public key (Settings → API). Use the **publishable** key suitable for client-side use in your security model.
   - `OPENAI_API_KEY` — your OpenAI API key (used in later features)

5. **Run the app** from the `gate1` directory:

   ```bash
   streamlit run app.py
   ```

   Open the URL shown in the terminal (usually `http://localhost:8501`).

## Using the app

- **Home (`app.py`):** Sign up or log in with email and password.
- **Sidebar pages** (Dashboard, Interview, Timeline, Story detail) require a signed-in session; otherwise you are prompted to return to the home page.

Session tokens are kept in `st.session_state` and restored on each run via the Supabase client.

## Project layout

| Path | Purpose |
|------|---------|
| `app.py` | Landing page and authentication |
| `auth.py` | Supabase session helpers and `require_auth()` |
| `pages/1_dashboard.py` | Person profiles (placeholder) |
| `pages/2_interview.py` | AI interview (placeholder) |
| `pages/3_timeline.py` | Timeline (placeholder) |
| `pages/4_story_detail.py` | Story detail + audio (placeholder) |
| `.streamlit/config.toml` | UI theme |
