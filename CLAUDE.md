# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:8080
npm run build        # Production build to dist/
npm run lint         # Run ESLint
npm run test         # Run Vitest once
npm run test:watch   # Run Vitest in watch mode
npm run preview      # Preview production build
```

## Architecture

Single-page React 18 + TypeScript + Vite application for calculating Islamic Zakat (2.5% annual charitable obligation on net wealth above a Nisab threshold).

**Entry flow:** `index.html` → `src/main.tsx` → `src/App.tsx` (React Router + TanStack Query providers) → `src/pages/Index.tsx`

**Core logic lives entirely in `src/pages/Index.tsx`:**
- All asset/liability state is managed with `useState`
- Calculations are memoized with `useMemo`
- Nisab threshold: 595g silver × $2.5/g ≈ $1,487.50
- Gold: $95/gram or $2,952/troy oz; Silver: $2.5/gram or $77.75/troy oz
- Zakat due = 2.5% of (total assets − total liabilities) if above Nisab

**Key custom components (`src/components/`):**
- `AssetInput.tsx` — reusable number input supporting both currency and weight-based assets (gold/silver auto-convert to USD)
- `ZakatHeader.tsx` — sticky header displaying total Zakat due
- `ZakatResult.tsx` — summary card (assets, liabilities, net wealth, Nisab, Zakat due)

**UI stack:** shadcn/ui (49 pre-built components in `src/components/ui/`) + Radix UI primitives + Tailwind CSS. Custom theme uses seafoam blue / emerald-gold palette with CSS custom properties for dark mode. Custom fonts: Playfair Display (headings), DM Sans (body).

**Testing:** Vitest with jsdom (`src/test/`). Playwright is configured (`playwright.config.ts`) but E2E tests are not yet written.

**Path alias:** `@/` resolves to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).

TanStack Query, React Hook Form, Zod, and Recharts are installed but not actively used — infrastructure is ready for future features.
