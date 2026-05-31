# Tradevada site

Static site served by the Cloudflare Worker **tradevada**.
All pages live in `public/`. Edit those files to change the site.

## Deploy

**Option A — Wrangler (one command):**
    npx wrangler deploy

**Option B — Git auto-deploy:**
Push this repo to GitHub, then in the Cloudflare dashboard:
Workers & Pages -> tradevada -> Settings -> Builds -> Connect to Git -> pick this repo.
After that, every push to the main branch deploys automatically.
