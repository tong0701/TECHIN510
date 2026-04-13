# Origins

**Capture the stories of the people you love — before they're lost to time.**

---

## What is Origins?

People forget their roots within two generations. Most of us cannot tell five detailed stories about our grandparents. Origins changes that. It is an AI-powered interview tool that guides users through recording the life stories of their loved ones via audio or text, then organizes those stories into a beautiful, browsable timeline accompanied by photos.

## The Problem

Family stories disappear. Every day, memories of lived experiences — childhood adventures, how grandparents met, what life was like in another era — fade away because no one took the time to ask and record them. There is no easy, guided way for everyday people to sit down and capture these stories before it is too late.

## The Solution

Origins provides:

- **AI-Powered Interviews** — Thoughtful, adaptive questions that draw out rich stories, just like talking to a skilled interviewer
- **Audio & Text Capture** — Record stories in your loved one's own voice, or type them out when audio isn't possible
- **Photo Uploads** — Attach family photos to stories and time periods
- **Visual Life Timeline** — An AI-organized chronological view of a person's life, built from the stories you capture

## Tech Stack

Implementation uses **Streamlit**, **Supabase** (Auth, PostgreSQL, Storage), and the **OpenAI API** (GPT for interviews, Whisper for speech-to-text). Details are in [`ARCHITECTURE.md`](ARCHITECTURE.md) and [`gate1/ARCHITECTURE.md`](gate1/ARCHITECTURE.md).

## AI Features

- Adaptive interview question generation (acts as an empathetic interviewer)
- Automatic story organization — extracts dates, themes, and events from narratives
- Chronological timeline construction from unstructured input

## Project Documents

| Document | Description |
|----------|-------------|
| [`SPEC.md`](./SPEC.md) | Full project specification with user stories and acceptance criteria |
| [`gix-bucks.md`](./gix-bucks.md) | GIX Bucks economy rules |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Technical architecture (data model, stack) |
| [`gate1/README.md`](gate1/README.md) | Run the Gate 1 Streamlit app locally |
| [`gate1/ARCHITECTURE.md`](gate1/ARCHITECTURE.md) | App-level C4 system context diagram |

---

## Development Timeline

The following timeline was agreed upon between the proposer and developer. Each gate represents a required progress check-in.

| Gate | Milestone | Target Date | Required Deliverables |
|------|-----------|-------------|----------------------|
| **Check-in 1** | Project Foundation | **End of Week 2** | Project scaffolded with chosen stack. User authentication (sign up / log in / log out) working. Database schema created and deployed. Basic app navigation between pages. `ARCHITECTURE.md` committed. |
| **Check-in 2** | Core Interview Engine | **End of Week 4** | AI interview question generation functional. Audio recording and text input capture working end-to-end. Stories saved to database and retrievable. Person profiles can be created and managed. At least 2 PRs merged and reviewed. |
| **Check-in 3** | Timeline & Polish | **End of Week 6** | Photo upload and association with stories working. AI-organized chronological timeline view complete. Story browsing and audio playback functional. UI polished and responsive on desktop and mobile. |
| **Final Delivery** | Demo-Ready Product | **Week 7–8** | All must-have acceptance criteria met. Bug fixes from proposer testing addressed. Performance and edge cases handled. Demo Day presentation ready. |

### Progress Expectations

- Developer submits at least **one PR every two weeks**
- Proposer reviews all PRs within **48 hours**
- Blockers are communicated immediately via GitHub Issues
- Each check-in includes a brief status update as a GitHub Issue comment or PR description

---

## Scope Sanity Check

- [x] One person can build this in ~40–60 hours using AI coding tools
- [x] Core value demonstrated with 2–3 pages/views (Interview + Timeline + Dashboard)
- [x] Data model requires only 1–2 database tables (plus users)
- [x] Must-have feature in one sentence: **AI-powered interview prompts with audio/text capture organized into a visual life timeline**

---

## Repository Structure

```
├── .github/            # Issue & PR templates
├── gate1/              # Gate 1 (Check-in 1) — Streamlit scaffold: auth, pages, theme
├── SPEC.md             # Project specification (user stories, acceptance criteria)
├── README.md           # This file
├── gix-bucks.md        # GIX Bucks economy rules
└── ARCHITECTURE.md     # Technical architecture (product + data model)
```

---

## License

This project is part of TECHIN 510 at the University of Washington.
