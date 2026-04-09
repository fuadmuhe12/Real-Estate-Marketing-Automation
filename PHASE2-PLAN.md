# Phase 2: Redux Store + Layout Shell + Token System UI

## Aesthetic Direction: "Midnight Slate"

Premium dark-sidebar SaaS dashboard. The sidebar is deep slate (#0F172A), the content area is light gray (#F8FAFC), and the accent color is **emerald** — evoking growth, wealth, and real estate. Cards are white with subtle borders and shadows. Typography uses Geist Sans (already loaded) with tight heading weights.

### Color Palette
- **Sidebar bg**: slate-900 (#0F172A)
- **Sidebar active**: slate-800 with emerald-500 left border accent
- **Sidebar text**: slate-400 (inactive), white (active)
- **Content bg**: slate-50 (#F8FAFC)
- **Cards**: white, border-slate-200, shadow-sm
- **Primary accent**: emerald-500 (#10B981)
- **Token healthy**: emerald-500, warning: amber-500, critical: red-500
- **Text**: slate-900 (headings), slate-600 (body), slate-400 (muted)

---

## Implementation Steps

### Step 1: Theme Overhaul (globals.css)
- Replace generic neutral oklch colors with the emerald/slate branded palette
- Add emerald as primary, keep destructive red
- Update sidebar colors to dark slate
- Add custom CSS for noise texture on sidebar background

### Step 2: Root Layout + Providers
- Update `src/app/layout.tsx`: add metadata (title: "AgentAI"), wrap with ReduxProvider + Toaster
- Add Google Font: Sora (distinctive heading font) alongside Geist

### Step 3: Redux Store
- `src/lib/store/index.ts` — configureStore with baseApi reducer + middleware
- `src/lib/store/hooks.ts` — typed useAppDispatch, useAppSelector
- `src/lib/store/tokenSlice.ts` — activeAgentName state
- `src/components/providers/ReduxProvider.tsx` — 'use client' wrapper

### Step 4: RTK Query API Layer
- `src/lib/api/baseApi.ts` — createApi with 5 tag types
- `src/lib/api/contentApi.ts` — generateContent mutation + getContentFeed query
- `src/lib/api/leadsApi.ts` — getLeads query + sendLeadToAi mutation
- `src/lib/api/automationApi.ts` — getAutomationLog query
- `src/lib/api/metricsApi.ts` — getMetrics query + getAgentTokens query

### Step 5: Layout Components
- `src/components/app-layout/Sidebar.tsx` — dark sidebar with nav, logo, token widget
- `src/components/app-layout/AppLayout.tsx` — flex shell: sidebar + content
- `src/modules/tokens/components/TokenDisplay.tsx` — progress bar, color-coded

### Step 6: Route Structure
- `src/app/(app)/layout.tsx` — wraps with AppLayout
- `src/app/page.tsx` — redirect to /dashboard
- Placeholder pages for: dashboard, generate, feed, leads, activity

### Step 7: Motion & Polish
- Staggered entrance animation on page transitions
- Smooth sidebar hover states
- Token progress bar animated width transition
