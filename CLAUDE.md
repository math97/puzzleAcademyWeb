# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run dev        # Vite dev server
pnpm run build      # TypeScript check + Vite production build
pnpm run lint       # ESLint
pnpm run preview    # Preview production build locally
```

## Architecture

Single-page application. All routing, state, and data fetching live in React components — no global state manager, no React Query.

```
src/
├── pages/              # Route-level components (one per route)
├── components/         # Feature components (stateful, data-aware)
├── core-components/    # Reusable UI primitives (stateless, styling-focused)
├── services/           # API calls and static data lookups
├── models/             # TypeScript interfaces for API responses and UI models
├── lib/utils.ts        # cn() Tailwind merge utility
├── data/champion.json  # Static Riot DDragon champion data (158KB)
└── hooks/              # (currently empty)
```

### Data Flow

```
Leaderboard.tsx
  → fetchPlayers(dateRange)         (services/api.ts, native Fetch)
  → rawPlayers: PlayerResponseItem[]
  → map + enrich with ChampionService
  → displayedPlayers: Player[]      (UI model, sorted by sortBy/sortDirection)
  → renders PlayerCard[] + controls
```

## Routing

React Router DOM v7. Single route:
- `/` → `Home.tsx` → renders `<Header>` + `<Leaderboard>`

## Pages & Components

### `components/Leaderboard.tsx`
The main feature component. It owns all data fetching and filtering state:

- **State**: `rawPlayers`, `displayedPlayers`, `loading`, `error`, `queueType` (SOLO|FLEX), `sortBy`, `sortDirection`, `timePeriod`
- **Queue types**: `RANKED_SOLO_5x5` / `RANKED_FLEX_SR`
- **Time periods**: Last 7/14/30 days, This week, This month, Season
- **Sort options**: RANK, PDL_CHANGE, WINRATE, LEVEL, SEASON_KILLS, SEASON_DEATHS, SEASON_ASSISTS, SEASON_KDA, BEST_MATCH_KDA
- **Data transformation**: Maps `PlayerResponseItem` → `Player` (UI model), enriches champion masteries with names/images from `ChampionService`, computes `seasonKda`, `pdlChange`, `winrate` from snapshot deltas.

Clicking a sort button that is already active toggles `sortDirection` (DESC → ASC). Clicking a new button sets it and resets to DESC.

### `components/PlayerCard.tsx`
Receives a `Player` (UI model) + `sortBy` prop. Shows a contextual stat based on current sort. On hover, reveals champion masteries with Riot CDN images.

### `core-components/`

All primitives use [CVA](https://cva.style/) for type-safe variant props and `React.forwardRef` for DOM ref forwarding.

| Component | Purpose |
|-----------|---------|
| `GlassCard` | Glass-morphism card (`.glass-card` from index.css). Accepts `hoverEffect` boolean. |
| `Container` | Max-width layout wrapper. Variants: `default` (max-w-7xl), `sm`, `lg`, `xl` (1400px), `full`. |
| `Badge` | Inline tag. Variants: `default`, `primary` (cyan, uppercase), `outline`. |
| `Text` | Polymorphic typography. `as` prop (h1–h4, p, span, div). `variant` (h1–h4, body, label, stat, statValue). `glow` (cyan, amber). |
| `Header` | Page header with title, tagline, and embedded `Countdown`. |
| `Countdown` | Live timer to next hour boundary (next snapshot), updates every second. |

**Component pattern:**
```typescript
const variants = cva("base-classes", {
  variants: { variant: { default: "...", primary: "..." } },
  defaultVariants: { variant: "default" }
})

interface Props extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof variants> {}

export const Component = React.forwardRef<HTMLDivElement, Props>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(variants({ variant, className }))} {...props} />
  )
)
```

Always use `cn()` from `@/lib/utils` to merge class names.

## Services

### `services/api.ts`
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api"

fetchPlayers(params?: { from?: Date; to?: Date; page?: number; limit?: number }): Promise<PlayersApiResponse>
```
Native Fetch API — no Axios, no React Query. Throws on non-OK responses.

### `services/champion.service.ts`
Singleton backed by `data/champion.json` (Riot DDragon). Methods:
- `ChampionService.getChampionById(id: number)` — O(1) lookup by numeric champion ID
- `ChampionService.getChampionImageUrl(championId: string)` — Returns CDN image URL

CDN base: `https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/`

## Models

Two distinct type layers in `src/models/Player.ts`:

**API types** (raw response from backend):
- `PlayerData` — flat player fields (tier, rank, LP, masteries, stats)
- `Snapshot` — point-in-time rank record with `totalPoints`, `wins`, `losses`
- `QueueStats` — snapshots array + computed delta stats (`pointsLostOrWon`, `winsChange`, `lossesChange`)
- `PlayerResponseItem` — `{ player: PlayerData, solo: QueueStats, flex: QueueStats }`
- `PlayersApiResponse` — `{ data: PlayerResponseItem[], meta: { total, page, lastPage } }`

**UI model** (after transformation in Leaderboard):
- `Player` — flat, display-ready: `rankPosition`, `name`, `tagline`, `tier`, `rankLabel`, `winrate`, `pdlChange`, `seasonKda`, `bestMatchKda`, `championMasteries[]` (enriched with name + image URL)

Always transform to the `Player` UI model inside `Leaderboard.tsx` before passing to child components. `PlayerCard` only ever receives `Player`.

## Design System

### Colors (CSS variables in `index.css`, consumed by Tailwind)
- `primary`: cyan (`180 100% 50%`) — CTAs, active states, glow effects
- `accent`: gold (`40 100% 50%`) — Rank 1 badge, header title glow
- `background`: dark purple (`270 60% 8%`)
- `secondary`: midnight blue (`230 50% 20%`)
- `muted`: dark purple (`270 40% 15%`)

### Typography
- **Display font** (`font-display`): Rajdhani — used for all headings, stats, rank labels
- **Body font** (`font-sans`): Inter

### Custom Utility Classes (in `index.css`)
- `.glass-card` — backdrop-blur-xl + semi-transparent card
- `.glow-text-cyan` / `.glow-text-amber` — text-shadow glow variants
- `.stat-positive` / `.stat-negative` — colored stat values
- `.rank-gold` — gold gradient + glow for 1st place rank badge

### Hover Pattern
Use `isHovered` local state + `onMouseEnter`/`onMouseLeave` for conditional expanded content. Animate revealed content with `animate-in fade-in duration-200` (tailwindcss-animate).

## Environment Variables

```
VITE_API_URL=https://puzzleacademyapi.m2adev.cloud/api   # Backend URL
```

Read at build time via `import.meta.env.VITE_API_URL`. Falls back to `/api` (relative) if not set.

## Deployment

Hosted on **Vercel**. Production URL: **https://puzzle-academy-web.vercel.app/**

Vercel is connected to the GitHub repo and auto-deploys every push to `main`. No manual deployment steps — merging a PR is enough to ship.

`VITE_API_URL` is set in the Vercel project environment variables to point to the production API on the VPS.

## GitHub Workflow

Use the **GitHub CLI** (`gh`) for all GitHub operations.

```bash
# Create a pull request
gh pr create --title "feat: description" --body "Summary of changes"

# List open PRs
gh pr list

# Check Vercel deploy / CI status
gh pr checks

# View recent Actions runs
gh run list
```

## Path Alias

`@/*` → `src/*` (configured in `vite.config.ts` and `tsconfig.app.json`).
