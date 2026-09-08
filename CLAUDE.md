# Braintail — Agent-First Brand Strategy Site

## What this is

Braintail is an agent-first website at braintail.ai. It serves brand strategy content
for iGaming B2B as clean markdown to AI agents, and redirects human browsers to the
full visual experience at positiveconstraint.com/braintail/.

## Architecture

- **Cloudflare Worker** (`worker/index.ts`) does content negotiation:
  - Agent requests (by Accept header or User-Agent) → serves raw `.md` files
  - Human browsers → serves `site/index.html` (minimal landing) or redirects to PosConCom
- **Content** lives in `site/` as markdown with YAML frontmatter
- **`llms.txt`** at the root is the agent front door — the index of all content
- **No build step for content** — markdown files are the source of truth, served as-is

## Content structure

```
site/
  method.md                     # The Braintail Method
  brand-plays.md                # Brand Plays
  presents/                     # Commercial showcases
    csb-group.md
    z-gaming.md
    tal-ron.md
  reviews/                      # Brand reviews (25 articles)
    155-milking-machines.md
    ...
```

## Deployment

```bash
npm install
npm run deploy       # deploys to Cloudflare
npm run dev          # local dev server
```

## Relationship to PosConCom

The human-facing site is positiveconstraint.com/braintail/ (managed in ../PosConCom).
This repo is the agent-facing counterpart. Content should stay in sync — when a new
review or presents page is added, it should appear in both repos.

## Domain

braintail.ai — DNS managed in Cloudflare, pointed at this Worker.

## Agent model selection

**Default is haiku. You must explicitly justify sonnet or opus.**

| Task type                                    | Model  |
|----------------------------------------------|--------|
| Read files, grep, ls, count, gather data     | haiku  |
| Browser automation, UI checks, form filling  | haiku  |
| Implementation, refactoring, debugging       | sonnet |
| Architecture, novel debugging, cross-cutting | opus   |

Rule: if you are about to write model="sonnet" for a read/search/count/browser task, change it to haiku.
