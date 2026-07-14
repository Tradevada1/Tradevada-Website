/* Sitewide pricing promo — progressive enhancement.
   Reads the admin-controlled promo from the app (same config that applies the
   Stripe coupon at checkout, so displayed price == charged price). If the
   fetch fails or no promo is running, the page keeps its default prices. */
(function () {
  var API = "https://app.tradevada.com/api/promo-status";
  var MAP = {
    proPlan: { m: "monthly", y: "yearly" },
    wolfPlan: { m: "wolfpack_monthly", y: "wolfpack_yearly" }
  };
  fetch(API).then(function (r) { return r.json(); }).then(function (p) {
    if (!p || !p.active || !p.plans) return;
    var tabs = document.querySelectorAll(".bill-toggle [data-bill]");
    var touched = false;
    Object.keys(MAP).forEach(function (cid) {
      var c = document.getElementById(cid);
      if (!c) return;
      var pm = p.plans[MAP[cid].m], py = p.plans[MAP[cid].y];
      if (!pm && !py) return;
      touched = true;
      if (pm && pm.promo_display) c.setAttribute("data-m-amt", pm.promo_display);
      if (py && py.promo_billed) {
        c.setAttribute("data-y-billed", py.promo_billed + " billed annually");
        c.setAttribute("data-y-amt", py.promo_display || "");
      }
      var pn = c.querySelector(".pname");
      if (pn && !c.querySelector(".promo-flag")) {
        var b = document.createElement("div");
        b.className = "promo-flag";
        b.style.cssText = "display:inline-block;margin:10px 0 0;padding:4px 12px;border-radius:100px;background:rgba(34,197,94,.14);border:1px solid rgba(34,197,94,.45);color:#4ade80;font-family:var(--mono,monospace);font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase";
        pn.parentNode.insertBefore(b, pn.nextSibling);
      }
      var row = c.querySelector(".price-row");
      if (row && !c.querySelector(".promo-was")) {
        var s = document.createElement("span");
        s.className = "promo-was";
        s.style.cssText = "text-decoration:line-through;color:rgba(232,234,237,.4);font-family:var(--mono,monospace);font-size:20px;font-weight:600;margin-right:8px";
        row.insertBefore(s, row.firstChild);
      }
      var upd = function () {
        var yearly = !!document.querySelector('.bill-toggle [data-bill="yearly"].active');
        var entry = yearly ? py : pm;
        var was = c.querySelector(".promo-was");
        if (was) {
          var orig = entry && entry.orig_display;
          was.textContent = orig || "";
          was.style.display = orig ? "" : "none";
        }
        // Monthly and yearly can carry different percents/durations - badge
        // and fine print follow the toggle.
        var flag = c.querySelector(".promo-flag");
        if (flag) {
          if (entry && entry.percent_off) {
            flag.textContent = (p.label || "LIMITED OFFER") + " · " + Math.round(entry.percent_off) + "% OFF"
              + (entry.duration_badge ? " · " + entry.duration_badge : "");
            flag.style.display = "";
          } else {
            flag.style.display = "none";
          }
        }
        var pnote = c.querySelector(".promo-note");
        if (pnote) {
          if (entry && entry.percent_off) {
            pnote.textContent = (entry.duration_badge === "FOREVER"
                ? "Promo price locked in for as long as you stay subscribed"
                : "Promo price applies to the " + (entry.duration_badge || "promo period").toLowerCase() + ", then standard pricing")
              + (p.ends_at ? " · offer ends " + new Date(p.ends_at).toLocaleDateString() : "") + ".";
            pnote.style.display = "";
          } else {
            pnote.style.display = "none";
          }
        }
      };
      tabs.forEach(function (t) {
        t.addEventListener("click", function () { setTimeout(upd, 0); });
      });
      c.__promoUpd = upd;
      var note = c.querySelector(".pnote");
      if (note && !c.querySelector(".promo-note")) {
        var n = document.createElement("div");
        n.className = "promo-note";
        n.style.cssText = "font-size:11px;color:rgba(232,234,237,.45);margin-top:6px;text-align:center";
        note.parentNode.insertBefore(n, note.nextSibling);
      }
    });
    if (!touched) return;
    // Re-run the page's own toggle renderer with the promo attributes in place.
    var act = document.querySelector(".bill-toggle [data-bill].active")
      || document.querySelector('.bill-toggle [data-bill="yearly"]');
    if (act) act.click();
    Object.keys(MAP).forEach(function (cid) {
      var c = document.getElementById(cid);
      if (c && c.__promoUpd) c.__promoUpd();
    });
  }).catch(function () {});
})();
