/**
 * Tradevada — Cloudflare Worker.
 *
 * Serves the static marketing site (the ./public folder, via the ASSETS
 * binding) and handles two JSON API routes that the site's forms POST to:
 *
 *   POST /api/contact    ← contact.html  (name, email, topic, subject, message, _gotcha)
 *   POST /api/subscribe  ← index.html #newsletter  (email, name)
 *
 * Both routes deliver mail through Resend (https://resend.com). This replaced
 * the old Formspree integration.
 *
 * ── Required secret ────────────────────────────────────────────────────────
 *   RESEND_API_KEY   Resend API key. Set as a Worker secret, NOT in the repo:
 *                        npx wrangler secret put RESEND_API_KEY
 *
 * ── Optional vars (set in the dashboard or wrangler.toml [vars]) ────────────
 *   CONTACT_TO        Where contact + subscribe notifications land.
 *                       Default: support@tradevada.com
 *   MAIL_FROM         Verified Resend sender. MUST be on a domain you've
 *                       verified in Resend. Default: Tradevada <noreply@tradevada.com>
 *   RESEND_AUDIENCE_ID  If set, newsletter signups are also added as a Resend
 *                       contact in this audience (for the actual mailing list).
 *
 * The Worker reads config from env with safe defaults, so it boots fine with
 * only RESEND_API_KEY set.
 */

const DEFAULTS = {
  CONTACT_TO: "support@tradevada.com",
  MAIL_FROM: "Tradevada <noreply@tradevada.com>",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      return handleContact(request, env);
    }
    if (url.pathname === "/api/subscribe") {
      return handleSubscribe(request, env);
    }

    // Everything else → static assets from ./public (ASSETS binding).
    return env.ASSETS.fetch(request);
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (v, max = 5000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

async function readJson(request) {
  if (request.method !== "POST") return null;
  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    return null;
  }
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function sendResendEmail(env, payload) {
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const detail = await resp.text().catch(() => "");
    throw new Error(`Resend ${resp.status}: ${detail}`);
  }
  return resp.json().catch(() => ({}));
}

// ── /api/contact ──────────────────────────────────────────────────────────

async function handleContact(request, env) {
  const body = await readJson(request);
  if (!body) return json({ error: "bad_request" }, 400);

  // Honeypot: real users never fill _gotcha. Pretend success, send nothing.
  if (clean(body._gotcha, 200)) return json({ ok: true });

  if (!env.RESEND_API_KEY) return json({ error: "not_configured" }, 500);

  const name = clean(body.name, 200);
  const email = clean(body.email, 320);
  const topic = clean(body.topic, 100);
  const subject = clean(body.subject, 300);
  const message = clean(body.message, 10000);

  if (!name || !email || !subject || !message || !EMAIL_RE.test(email)) {
    return json({ error: "invalid_fields" }, 400);
  }

  const to = env.CONTACT_TO || DEFAULTS.CONTACT_TO;
  const from = env.MAIL_FROM || DEFAULTS.MAIL_FROM;

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Topic:</strong> ${escapeHtml(topic || "—")}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <hr>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  try {
    await sendResendEmail(env, {
      from,
      to: [to],
      reply_to: email,
      subject: `[Contact${topic ? " · " + topic : ""}] ${subject}`,
      html,
    });
  } catch (err) {
    console.error("contact send failed:", err);
    return json({ error: "send_failed" }, 502);
  }

  return json({ ok: true });
}

// ── /api/subscribe ──────────────────────────────────────────────────────────

async function handleSubscribe(request, env) {
  const body = await readJson(request);
  if (!body) return json({ error: "bad_request" }, 400);

  if (!env.RESEND_API_KEY) return json({ error: "not_configured" }, 500);

  const email = clean(body.email, 320);
  const name = clean(body.name, 200);
  if (!email || !EMAIL_RE.test(email)) {
    return json({ error: "invalid_email" }, 400);
  }

  const to = env.CONTACT_TO || DEFAULTS.CONTACT_TO;
  const from = env.MAIL_FROM || DEFAULTS.MAIL_FROM;

  // 1) Add to the Resend audience if one is configured (the real list).
  if (env.RESEND_AUDIENCE_ID) {
    try {
      const resp = await fetch(
        `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            first_name: name || undefined,
            unsubscribed: false,
          }),
        }
      );
      // 409 = already a contact; treat as success.
      if (!resp.ok && resp.status !== 409) {
        console.error("audience add failed:", resp.status, await resp.text().catch(() => ""));
      }
    } catch (err) {
      console.error("audience add error:", err);
    }
  }

  // 2) Always notify the team so the signup is captured even without an audience.
  try {
    await sendResendEmail(env, {
      from,
      to: [to],
      reply_to: email,
      subject: `[Newsletter] New subscriber: ${email}`,
      html: `<p><strong>Email:</strong> ${escapeHtml(email)}</p>
             <p><strong>Name:</strong> ${escapeHtml(name || "—")}</p>`,
    });
  } catch (err) {
    console.error("subscribe notify failed:", err);
    return json({ error: "send_failed" }, 502);
  }

  return json({ ok: true });
}
