# MeetMind — AI Meeting Intelligence Platform

> **Microsoft Build AI Hackathon 2026** | Theme: AI at Work: Productivity & Teamwork Reimagined

## Problem Statement

Professionals spend **31 hours per month** in unproductive meetings. **70% of action items** discussed in meetings are never followed up on. Existing tools either transcribe without understanding, or summarize without extracting next steps. MeetMind solves all three gaps in one platform.

## Solution Overview

MeetMind is a real-time AI meeting copilot that:
- 🎙️ Records and transcribes meetings using **Groq Whisper Large V3**
- 🧠 Analyzes transcripts using **Groq Llama 3.3 70B** to extract structured insights
- ✅ Automatically generates action items with owners, priorities, and due dates
- 📧 Drafts follow-up emails in one click
- 🔍 Provides a searchable dashboard of all past meetings

## Live Demo

🔗 **Live App:** [https://meetmind.vercel.app](https://meetmind.vercel.app)  
🎥 **Demo Video:** [YouTube Link]  
📁 **GitHub:** [https://github.com/yourusername/meetmind](https://github.com/yourusername/meetmind)

## Architecture

```
Browser (Next.js 16 App Router)
  → Groq Whisper Large V3   → Real-time Transcription
  → Groq Llama 3.3 70B      → Summary, Action Items, Email Draft
  → MongoDB Atlas           → Persistent Storage
  → NextAuth.js             → Google OAuth
  → Vercel                  → Deployment
```

## Microsoft AI Stack Used

| Service | Usage |
|---|---|
| GitHub Copilot | AI-assisted development (satisfies Microsoft stack requirement) |

## AI Tools Used in Development

| Tool | Purpose |
|---|---|
| GitHub Copilot | Inline code suggestions and autocompletion |
| Groq Whisper Large V3 | Real-time audio transcription |
| Groq Llama 3.3 70B | Meeting analysis, action items, email generation |
| Claude (Anthropic) | Architecture planning and prompt engineering |
| Cursor | AI-assisted full-stack code generation |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + Custom CSS (glassmorphism) |
| Transcription | Groq Whisper Large V3 |
| AI Analysis | Groq Llama 3.3 70B |
| Database | MongoDB Atlas (Mongoose) |
| Auth | Clerk (v7) |
| Animations | Framer Motion |
| Data Fetching | SWR |
| Deployment | Vercel |

## Setup Instructions

### Prerequisites
- Node.js 18+
- Groq account — free at [console.groq.com](https://console.groq.com)
- MongoDB Atlas account (free tier)
- Clerk account — free at [clerk.com](https://clerk.com)

### Local Development

```bash
git clone https://github.com/yourusername/meetmind
cd meetmind
npm install --legacy-peer-deps
cp .env.example .env.local
# Fill in your Groq API key and MongoDB credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

See `.env.example` for all required variables.

```env
# Groq AI (free - get from console.groq.com)
GROQ_API_KEY=your_groq_api_key_here

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meetmind

# Clerk Authentication (free - get from clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Groq API Setup

1. Go to [console.groq.com](https://console.groq.com) → Create API key (free)
2. Copy the key to `GROQ_API_KEY` in `.env.local`
3. Models used: `whisper-large-v3` (transcription) + `llama-3.3-70b-versatile` (analysis)

### MongoDB Atlas Setup

1. [cloud.mongodb.com](https://cloud.mongodb.com) → Create free cluster (M0)
2. Create database: `meetmind`
3. Copy connection string to `.env.local`

### Clerk Authentication Setup

1. [clerk.com](https://clerk.com) → Create a new application
2. Enable Email/Password or Social Logins (Google/Microsoft)
3. Copy Publishable and Secret keys to `.env.local`
4. For deployment, add your live domain in the Clerk dashboard.

## Features

- ✅ Real-time audio recording in browser (MediaRecorder API)
- ✅ Groq Whisper Large V3 transcription (fast, accurate)
- ✅ Groq Llama 3.3 70B meeting analysis (summary, decisions, action items)
- ✅ One-click follow-up email generation
- ✅ Action items with owner, priority, and due date
- ✅ Searchable meeting history dashboard
- ✅ Secure authentication (Clerk)
- ✅ Responsive design (mobile + desktop)
- ✅ Export to PDF (window.print())
- ✅ Microsoft Azure enterprise UI (Light Theme)
- ✅ Framer Motion animations

## Project Structure

```
meetmind/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   ├── dashboard/page.tsx            # Dashboard
│   ├── meeting/new/page.tsx          # New meeting recorder
│   ├── meeting/[id]/page.tsx         # Meeting detail (3-panel)
│   └── api/                          # API routes
│       ├── auth/[...nextauth]/       # NextAuth
│       ├── meetings/                 # CRUD
│       ├── transcribe/               # Groq Whisper
│       ├── analyze/                  # Groq Llama 3.3 70B
│       ├── summarize/                # Groq summary
│       ├── action-items/             # Groq action extraction
│       └── email-draft/              # Groq email generation
├── components/
│   ├── ui/                           # Button, Card, Badge, Modal, Spinner, Toast
│   ├── layout/                       # Navbar, Sidebar, PageWrapper
│   ├── meeting/                      # MeetingCard, MeetingRecorder, TranscriptViewer,
│   │                                 #   SummaryPanel, ActionItemsList, EmailDraftModal, SpeakerTag
│   └── dashboard/                    # StatsBar, RecentMeetings, SearchBar
├── lib/                              # mongodb, groq, prompts, utils
├── models/                           # Meeting, ActionItem, User (Mongoose)
├── hooks/                            # useMeetingRecorder, useMeetings, useTranscript
└── types/                            # TypeScript interfaces
```

> All AI-generated code was reviewed, modified, and validated by the team. Prompts, architecture decisions, UI design, and business logic were created with meaningful human judgment throughout.

> All AI-generated code was reviewed, modified, and validated by the team. Prompts, architecture decisions, UI design, and business logic were created with meaningful human judgment throughout.

## Team

**Team Name:** BerryBytes

| Name | Role |
|---|---|
| Aditya Gupta | Leader / Full Stack Developer |
| Dhairya Bhatnagar | Team Member / AI Integration |

## License

MIT — see [LICENSE](LICENSE)
