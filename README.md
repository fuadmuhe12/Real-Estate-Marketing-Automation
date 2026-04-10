# AgentAI — Real Estate Marketing Automation

AI-powered content generation, CRM lead management, and automation platform for real estate agents. Built with Next.js, Groq AI, Prisma, and Redux Toolkit.

## Features

- **AI Content Generation** — Generate social media captions, image prompts, and brand tone using Groq AI (qwen/qwen3-32b)
- **Content Feed** — Browse all previously generated content with audience/tone badges
- **CRM Leads** — Manage leads with status filters (All/New/Hot/Cold) and "Send to AI" follow-up generation
- **Automation Engine** — Auto-logs all AI actions: post simulations, follow-up messages, call triggers
- **Token System** — Each agent starts with 100 tokens. Content generation costs 5, lead follow-ups cost 10. Real-time balance tracking
- **Reporting Dashboard** — Metric cards, per-agent token usage charts, and recent activity feed

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| AI | Groq SDK — qwen/qwen3-32b (with mock fallback) |
| Database | SQLite + Prisma ORM |
| State | Redux Toolkit + RTK Query |
| Forms | React Hook Form + Zod v4 |
| UI | Tailwind CSS v4 + shadcn/ui (base-nova) |
| Icons | Lucide React |
| Animations | Motion (framer-motion) |
| Toasts | Sonner |

## Getting Started

### Prerequisites

- Node.js >= 20
- npm

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd ai-automation

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your GROQ_API_KEY (optional — app works with mock data)

# Run database migration + seed
npx prisma migrate dev
# Seeds automatically: 1 agent (Sarah Johnson, 100 tokens) + 10 leads

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to the Dashboard.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite path (auto-set to `file:./dev.db`) |
| `GROQ_API_KEY` | No | Groq API key for real AI. Without it, realistic mock data is used |

## Architecture

```
src/
├── app/                  # Next.js App Router
│   ├── (app)/            # Route group with sidebar layout
│   │   ├── dashboard/    # Reporting metrics + charts
│   │   ├── generate/     # AI content generation form
│   │   ├── feed/         # Content feed
│   │   ├── leads/        # CRM lead management
│   │   └── activity/     # Automation activity log
│   └── api/              # 7 REST API routes
├── components/
│   ├── ui/               # shadcn/ui primitives
│   ├── app-layout/       # Sidebar, MobileNav, MobileHeader
│   └── providers/        # Redux provider
├── lib/
│   ├── ai/               # Groq + mock AI service (strategy pattern)
│   ├── api/              # RTK Query endpoints
│   ├── store/            # Redux store + token slice
│   ├── prisma.ts         # Prisma singleton
│   └── utils.ts          # cn() utility
└── modules/
    ├── content-generation/   # ContentForm, ContentResult, ContentFeed
    ├── crm/                  # LeadsList, LeadFilters, SendToAiDialog
    ├── automation/           # ActivityLog
    ├── reporting/            # MetricCards, TokenUsageChart, RecentActivity
    └── tokens/               # TokenDisplay (sidebar widget)
```

### Key Design Decisions

- **Strategy pattern for AI** — `src/lib/ai/index.ts` switches between Groq and mock based on `GROQ_API_KEY` presence. App always works, with or without API key
- **Module-based folders** — Features are organized by domain (`crm/`, `content-generation/`) not by technical layer, enabling clear ownership
- **Server-side token enforcement** — Token balance lives in the database, deducted in transactions. Client displays it but can't bypass limits
- **Automation via API side-effects** — Creating content auto-creates a "post_simulated" log. Sending a hot lead to AI auto-creates a "follow_up_generated" log. No separate automation config needed
- **RTK Query tag invalidation** — Mutations automatically refresh related data (content feed, token balance, metrics, activity log)

