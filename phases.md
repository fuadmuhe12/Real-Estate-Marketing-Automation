# AI Automation App - Implementation Phases

## Overview
AI-powered real estate marketing automation platform built with Next.js, Groq AI, Prisma/SQLite, RTK Query, and shadcn/ui.

---

## Phase 1: Foundation + Database + AI Service + API Routes
**Goal**: Set up the entire project skeleton, database, AI integration with Groq, and all 7 backend API routes. By the end of this phase, the backend is fully functional and testable via API calls.

### 1.1 Project Scaffold
- Initialize Next.js app (TypeScript, Tailwind CSS v4, App Router, src directory)
- Install all dependencies:
  - **Core**: `@prisma/client`, `groq-sdk`, `zod`
  - **State**: `@reduxjs/toolkit`, `react-redux`
  - **Forms**: `react-hook-form`, `@hookform/resolvers`
  - **UI**: `lucide-react`, `sonner`, `motion`, `class-variance-authority`, `clsx`, `tailwind-merge`
  - **Dev**: `prisma`, `tw-animate-css`
- Initialize shadcn/ui and add components: button, badge, card, input, label, select, skeleton, table, tabs, form, dialog, separator, tooltip
- Set up `src/lib/utils.ts` (cn utility) and `src/lib/appToast.ts` (Sonner wrapper)

### 1.2 Database (Prisma + SQLite)
- Initialize Prisma with SQLite provider
- Define schema with 4 models:
  - **Agent**: id, name (unique), tokens (default 100), createdAt
  - **Content**: id, agentId→Agent, audience, city, caption, imagePrompt, brandTone, createdAt
  - **Lead**: id, name, phone, status (new/hot/cold), lastContacted, createdAt
  - **AutomationLog**: id, type, agentId→Agent, contentId?→Content, leadId?→Lead, message, metadata?, createdAt
- Run initial migration
- Write seed script with:
  - 1 default agent ("Sarah Johnson") with 100 tokens
  - 10 mock leads with varied statuses, names, phones, and lastContacted dates
- Create `src/lib/prisma.ts` singleton for Next.js

### 1.3 Groq AI Service
- Create `src/lib/ai/index.ts` — exports `generateContent()` and `generateFollowUp()` functions
- Create `src/lib/ai/groq.ts` — uses `groq-sdk` with model `qwen/qwen3-32b`:
  - `generateContent(agentName, audience, city)` → returns `{ caption, imagePrompt, brandTone }`
  - `generateFollowUp(leadName, leadStatus, agentName)` → returns follow-up message string
  - System prompts tuned for real estate marketing context
  - Responses parsed as JSON from the model output
- Create `src/lib/ai/mock.ts` — fallback with realistic hardcoded responses per audience type + 500ms delay
- Strategy: if `GROQ_API_KEY` exists → use Groq, else → use mock

### 1.4 API Routes (7 endpoints)
All routes include Zod input validation and proper error responses.

1. **POST `/api/content`** — Generate AI content
   - Input: `{ agentName, audience, city }`
   - Logic: find/create agent → check tokens >= 5 → call AI → store Content → deduct 5 tokens → create AutomationLog (type: "post_simulated") → return result + token balance

2. **GET `/api/content/feed`** — List past content
   - Returns all Content records with Agent data, ordered by createdAt DESC

3. **GET `/api/leads?status=hot`** — List leads with optional filter
   - Query param `status` filters by lead status
   - Returns leads ordered by lastContacted DESC

4. **POST `/api/leads/[id]/send-to-ai`** — Send lead to AI
   - Input: `{ agentName }`
   - Logic: find lead → find/create agent → check tokens >= 10 → call AI for follow-up → deduct 10 tokens → update lastContacted → create AutomationLog (type based on lead status: "follow_up_generated" for hot, "call_triggered" for others) → return message + token balance

5. **GET `/api/agents/[name]/tokens`** — Get token balance
   - Returns `{ name, tokens }`

6. **GET `/api/automation/log`** — Activity log
   - Returns all AutomationLog records with Agent, Content, Lead relations, ordered by createdAt DESC

7. **GET `/api/metrics`** — Reporting metrics
   - Returns: `{ postsGenerated, leadsContacted, tokensUsed, agentMetrics[] }`
   - postsGenerated = count of Content records
   - leadsContacted = count of AutomationLog where type includes "follow_up" or "call"
   - tokensUsed = sum of (100 - agent.tokens) across all agents
   - agentMetrics = per-agent breakdown (name, tokens remaining, posts count)

### 1.5 Environment Setup
- Create `.env.local` with `GROQ_API_KEY` and `DATABASE_URL`
- Create `.env.example` documenting required/optional vars

### Phase 1 Deliverables
- Fully working backend testable via curl/Postman
- Database seeded with mock data
- AI integration working with Groq (or mock fallback)
- All 7 API routes returning correct data

---

## Phase 2: Redux Store + Layout Shell + Token System UI
**Goal**: Set up client-side state management, the app layout with sidebar navigation, and the token display system. By the end of this phase, the app shell is navigable with working token tracking.

### 2.1 Redux Store Setup
- Create `src/lib/api/baseApi.ts` — RTK Query createApi with tag types: Content, Leads, Tokens, AutomationLog, Metrics
- Create `src/lib/api/contentApi.ts` — injectEndpoints:
  - `generateContent` mutation (POST /api/content) → invalidates Content, Tokens, AutomationLog, Metrics
  - `getContentFeed` query (GET /api/content/feed) → provides Content
- Create `src/lib/api/leadsApi.ts` — injectEndpoints:
  - `getLeads` query (GET /api/leads) → provides Leads
  - `sendLeadToAi` mutation (POST /api/leads/[id]/send-to-ai) → invalidates Leads, Tokens, AutomationLog, Metrics
- Create `src/lib/api/automationApi.ts` — injectEndpoints:
  - `getAutomationLog` query (GET /api/automation/log) → provides AutomationLog
- Create `src/lib/api/metricsApi.ts` — injectEndpoints:
  - `getMetrics` query (GET /api/metrics) → provides Metrics
- Create `src/lib/store/tokenSlice.ts` — manages `activeAgentName` state
- Create `src/lib/store/index.ts` — configureStore with baseApi middleware
- Create `src/lib/store/hooks.ts` — typed useAppDispatch, useAppSelector
- Create `src/components/providers/ReduxProvider.tsx` — 'use client' wrapper

### 2.2 Layout Shell
- Create `src/components/app-layout/Sidebar.tsx`:
  - Navigation links: Dashboard, Generate, Feed, Leads, Activity
  - Lucide icons per link (LayoutDashboard, Sparkles, Rss, Users, Zap)
  - Active link highlighting based on current pathname
  - TokenDisplay component at the bottom
  - Mobile responsive (collapsible on small screens)
- Create `src/components/app-layout/AppLayout.tsx`:
  - Flexbox: sidebar (w-64) + scrollable content area with padding
- Wire root `src/app/layout.tsx` with ReduxProvider + Toaster
- Wire `src/app/(app)/layout.tsx` with AppLayout
- Create `src/app/page.tsx` — redirect to /dashboard

### 2.3 Token Display (Req 5 - UI)
- Create `src/modules/tokens/components/TokenDisplay.tsx`:
  - Shows active agent name and remaining token count
  - Color-coded progress bar: green (>50), yellow (20-50), red (<20)
  - Fetches from GET /api/agents/[name]/tokens via RTK Query
  - Auto-refreshes when mutations invalidate the Tokens tag
  - Agent selector dropdown if multiple agents exist

### Phase 2 Deliverables
- App shell with working sidebar navigation
- All RTK Query endpoints wired and ready
- Token display in sidebar updating in real-time
- All page routes created (empty placeholder content)

---

## Phase 3: Core Feature Pages (Content Generation + CRM)
**Goal**: Build the two main feature pages — content generation with feed, and CRM leads with "Send to AI" functionality. These are the most interactive and impressive parts of the app.

### 3.1 Content Generation Page (Req 1)
- Create `src/modules/content-generation/components/ContentForm.tsx`:
  - React Hook Form + Zod validation
  - Fields: Agent Name (input), Target Audience (select: buyer/seller/investor), City (input)
  - Submit button with loading spinner
  - Calls generateContent RTK mutation
  - Shows token cost ("This will cost 5 tokens")
  - Error toast on insufficient tokens
  - Success toast on generation
- Create `src/modules/content-generation/components/ContentResult.tsx`:
  - Card displaying: social media caption, image prompt, brand tone badge
  - Motion fade-in animation on appear
  - Copy-to-clipboard button on caption
- Wire `src/app/(app)/generate/page.tsx` — form + result side by side or stacked

### 3.2 Content Feed Page (Req 2)
- Create `src/modules/content-generation/components/ContentFeed.tsx`:
  - Fetches getContentFeed RTK query
  - Grid or list of cards, each showing: agent name, audience badge, city, caption, tone badge, timestamp
  - Skeleton loading states
  - Empty state when no content yet
- Wire `src/app/(app)/feed/page.tsx`

### 3.3 CRM Leads Page (Req 3)
- Create `src/modules/crm/components/LeadFilters.tsx`:
  - Tab buttons: All / New / Hot / Cold
  - Hot tab has flame icon
  - Controls the status query param passed to getLeads
- Create `src/modules/crm/components/LeadsList.tsx`:
  - shadcn Table component
  - Columns: Name, Phone, Status (color-coded Badge), Last Contacted (relative time)
  - "Send to AI" button per row (Sparkles icon)
  - Skeleton loading state
- Create `src/modules/crm/components/SendToAiDialog.tsx`:
  - Opens on "Send to AI" click
  - Agent name input (pre-filled if active agent set)
  - Shows token cost ("This will cost 10 tokens")
  - Calls sendLeadToAi RTK mutation
  - Displays AI-generated follow-up message in the dialog
  - Success/error toasts
- Wire `src/app/(app)/leads/page.tsx` — filters + table

### Phase 3 Deliverables
- Fully working content generation → view in feed flow
- Fully working CRM leads → filter → send to AI → see follow-up flow
- Token deductions working on both flows
- Toast notifications for all actions

---

## Phase 4: Automation Log + Reporting Dashboard + Polish
**Goal**: Build the remaining pages (automation activity log and reporting dashboard), add visual polish, write README, and ensure everything works end-to-end.

### 4.1 Automation Activity Page (Req 4)
- Create `src/modules/automation/components/ActivityLog.tsx`:
  - Fetches getAutomationLog RTK query
  - Timeline-style list with:
    - Icon per type: Image (post), MessageSquare (follow-up), Phone (call trigger)
    - Agent name badge
    - Description message
    - Lead name (if applicable)
    - Timestamp (relative)
  - Color coding per automation type
  - Skeleton loading state
  - Empty state
- Wire `src/app/(app)/activity/page.tsx`
- Both automations are already implemented in the API routes:
  - Content creation → auto-logs "post_simulated" (Req 4 Option A)
  - Hot lead send-to-AI → auto-logs "follow_up_generated" (Req 4 Option B)

### 4.2 Reporting Dashboard (Req 6)
- Create `src/modules/reporting/components/MetricCards.tsx`:
  - 3 summary cards in a responsive grid:
    1. Posts Generated (FileText icon + count)
    2. Leads Contacted (Users icon + count)
    3. Tokens Used (Coins icon + count)
  - Motion staggered entrance animation
- Create `src/modules/reporting/components/RecentActivity.tsx`:
  - Last 5 automation logs in a compact list
  - "View all" link to /activity
- Create `src/modules/reporting/components/TokenUsageChart.tsx`:
  - CSS horizontal bar chart showing token usage per agent
  - Bar width proportional to tokens used (out of 100)
  - Color matches the token color scheme (green/yellow/red)
- Wire `src/app/(app)/dashboard/page.tsx` — metric cards + chart + recent activity

### 4.3 Polish & Final Touches
- Add motion entrance animations to all page content
- Ensure consistent loading skeletons across all pages
- Responsive design check (sidebar collapse on mobile)
- Final spacing, typography, and color pass
- Write `README.md` with:
  - Project description
  - Tech stack overview
  - Setup instructions (clone, install, env, migrate, seed, run)
  - Screenshots of key pages
  - Architecture decisions
  - "What I would build next" section (for the Loom video talking points)
- Create `.env.example`
- Test full end-to-end flows:
  1. Generate content → feed → activity log → dashboard metrics → token deduction
  2. Filter hot leads → send to AI → activity log → dashboard → token deduction
  3. Token depletion error handling
  4. Mock fallback (no API key)
  5. Fresh clone setup test

### Phase 4 Deliverables
- Complete, polished, fully working application
- All 6 requirements implemented and verified
- README with setup instructions
- Ready for GitHub submission + Loom recording
