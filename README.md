# TECHIN 510

Course materials for **TECHIN 510**.

## Lab 1

See **[lab1/README.md](lab1/README.md)** for the Week 1 lab (Purchase Tracker, GIX Wayfinder, and report).

---

## Origins (final project)

**Capture the stories of the people you love — before they're lost to time.**

Origins is an AI-powered interview tool for recording life stories (audio or text), organized into a timeline with photos. This repo includes the **Streamlit + Supabase** app under [`Origins/`](Origins/).

| Document | Description |
|----------|-------------|
| [`SPEC.md`](SPEC.md) | Project specification (user stories, acceptance criteria) |
| [`Origins/README.md`](Origins/README.md) | Run the app locally (env, Supabase, Streamlit) |
| [`Origins/ARCHITECTURE.md`](Origins/ARCHITECTURE.md) | System context and technical architecture |

### Tech stack (Origins)

Streamlit · Supabase (Auth, Postgres, Storage) · OpenAI API

### Development timeline (gates)

| Gate | Milestone | Target | Deliverables |
|------|-----------|--------|----------------|
| **Check-in 1** | Project foundation | End of Week 2 | Scaffold, auth, DB schema, navigation, `ARCHITECTURE.md` |
| **Check-in 2** | Core interview engine | End of Week 4 | AI questions, audio/text capture, stories in DB, person profiles |
| **Check-in 3** | Timeline & polish | End of Week 6 | Photos, chronological timeline, story browsing & playback |
| **Final** | Demo-ready | Week 7–8 | Must-haves met, demo ready |

### Repository layout (high level)

```
├── lab1/                 # Week 1 lab
├── Origins/              # Final project app (Streamlit)
├── SPEC.md               # Origins specification
├── gix-bucks.md          # GIX Bucks economy rules
└── README.md             # This file
```

---

## License

This project is part of TECHIN 510 at the University of Washington.
