# Tradevada site

Static site served by the Cloudflare Worker **tradevada**.
All pages live in `public/`. Edit those files to change the site.

The Worker (`src/index.js`) also handles two form endpoints via Resend:

- `POST /api/contact`   - the contact form (`public/contact.html`)
- `POST /api/subscribe` - the newsletter form (`public/index.html` #newsletter)

Everything else falls through to the static assets in `public/`.

## Configuration

The Worker needs one secret. Set it once (never commit it):

    npx wrangler secret put RESEND_API_KEY

Optional vars (defaults are sensible; override in the Cloudflare dashboard or
`wrangler.toml` `[vars]`):

- `CONTACT_TO` - where contact + subscribe notifications land. Default `support@tradevada.com`.
- `MAIL_FROM` - verified Resend sender. Default `Tradevada <noreply@tradevada.com>`. Must be on a domain verified in Resend.
- `RESEND_AUDIENCE_ID` - if set, newsletter signups are also added to this Resend audience (the real mailing list).

## Deploy

**Option A - Wrangler (one command):**
    npx wrangler deploy

**Option B - Git auto-deploy:**
Push this repo to GitHub, then in the Cloudflare dashboard:
Workers & Pages -> tradevada -> Settings -> Builds -> Connect to Git -> pick this repo.
After that, every push to the main branch deploys automatically.
