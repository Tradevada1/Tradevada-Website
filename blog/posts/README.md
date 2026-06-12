# Blog posts

Each `.md` file here becomes a page at `tradevada.com/blog/<slug>`. Publishing flow:

1. Add or edit a `.md` file in this folder.
2. Run `npm run deploy` from the repo root (builds the blog, then `wrangler deploy`). First time on a machine: `npm install` once.

`npm run build:blog` builds without deploying — output goes to `public/blog/` and the sitemap is updated automatically.

Required front matter at the top of every post:

```
---
title: How to Calculate Annualized Return on Cash-Secured Puts
slug: annualized-return-cash-secured-puts
description: The formula wheel traders should use, with worked examples.
date: 2026-06-15
tag: Wheel Strategy
read_minutes: 6
og_image: /img/blog/annualized-return-og.png
---
```

Field notes:

- `slug` — lowercase letters, digits, and dashes only. Becomes the URL. Posts with invalid slugs are skipped with a warning.
- `date` — `YYYY-MM-DD`. Controls sort order (newest first) and sitemap lastmod.
- `tag` — the pill shown on cards and the article header.
- `read_minutes` — integer; defaults to 5.
- `og_image` — path under `public/`. Defaults to `/img/blog/og-default.png`. Social cards want 1200×630.

The body is standard Markdown (tables and fenced code supported). The mid-article waitlist CTA is inserted automatically before the second `##` heading, so write at least two sections; the end-of-article CTA always renders.

The generated pages reuse the live site's nav, footer, fonts, and design tokens (extracted from `public/about.html` at build time), so blog pages always match the current site design.
