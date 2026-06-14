# ALMA Website

High-end rental housing marketing site. Static HTML/CSS with lightweight JS, built to deploy
on GitHub + Vercel.

This is a **new, standalone project** (unrelated to any other site in this account).

## Project rules

All working rules — persona, Emil Kowalski design philosophy, the Graphify-first workflow,
ALMA branding (palette + typography), the "Grill me on ALMA" command, and operational
constraints — live in [`CLAUDE.md`](CLAUDE.md).

## Skills (`.claude/skills/`)

| Skill | Purpose |
|---|---|
| `graphify` | Map architecture into `GRAPH_REPORT.md` (run before any design change). |
| `emil-design-eng` | Emil Kowalski motion & component craft. |
| `taste` | Variance / motion / density dials to escape boilerplate UI. |
| `impeccable` | Detector rules against generic "AI-looking" design. |
| `seo` | Falsifiable SEO audit + internal-linking checklist. |
| `grill-me` | One-question-at-a-time stress-test interview. |

Custom command: **`/grill-me-on-alma`** — quizzes you about the repo, UI, architecture,
accessibility, performance, and leasing strategy.

## Status

- [x] Workspace + local git initialized
- [x] Skills + CLAUDE.md + command authored
- [x] Single-page site built (`index.html` + `styles.css` + `main.js` + `units.js`) — verified, WCAG AA
- [x] Available units (sortable), promotions, common areas, neighbourhood, in-page video modal,
      Apply (mailto), Book a tour (Calendly)
- [x] `GRAPH_REPORT.md` generated from real code
- [ ] GitHub remote (deferred — local git only for now)
- [ ] Real video IDs (set `videoId` per unit in `units.js`)
- [ ] Real fonts + photography (drop into `assets/`, no code change needed)

## Brand quick reference

- **Blue** `#0072CE` / `#4981D8` · **Orange** `#FA4616` · **Mint** `#E3EFCE` · **Taupe**
  `#CABFA5` · **Navy** `#1A2732` · **Black** `#101010` · **Pink** `#F2AFC5`
- Display: **Garage Gothic Bold** (uppercase headlines) · Body: **Helvetica** (Roboto fallback)
