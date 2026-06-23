---
title: How to Calculate Annualized Return on Cash-Secured Puts
seo_title: Annualized Return on Cash-Secured Puts
slug: annualized-return-cash-secured-puts
description: The formula wheel traders should use, with worked examples.
date: 2026-06-15
tag: Wheel Strategy
read_minutes: 6
hero_image: /img/blog/annualized-return-cash-secured-puts.jpg
---

Selling a cash-secured put for $44 sounds small until you ask the only question that matters: what is that premium worth as a rate of return on the cash you parked to secure it? Two trades with identical premiums can have wildly different answers, and the difference is time.

## The formula

Annualized return on a CSP comes down to three inputs: the premium you collected, the cash securing the put, and how many days the trade ran.

**Annualized % = (premium ÷ collateral) × (365 ÷ days held) × 100**

The collateral is the strike times 100 per contract. A $17.50 strike means $1,750 of cash set aside per contract, whether your broker shows it that way or not.

## A worked example

Say you sell one $17.50 put for $0.44 with 14 days to expiry and let it expire worthless.

- Premium: $44
- Collateral: $1,750
- Days held: 14

Raw yield is 44 ÷ 1,750 = 2.51%. That looks modest - but it took two weeks, not a year. Annualized: 2.51% × (365 ÷ 14) = **65.5%**.

Run the same premium on a 45-day contract and the annualized figure drops to about 20%. Same $44. Very different rate.

## Why this changes which trades you take

Once you annualize consistently, shorter-dated premium often beats fatter, longer-dated premium - and you can finally compare a 7 DTE trade against a 45 DTE trade on equal footing. It also keeps you honest about early exits: buying back at 50% profit in a third of the time usually raises your annualized return even though you left premium on the table.

The catch is the bookkeeping. Every fill, every buyback, every expiry needs the dates and the collateral tracked per trade - which is exactly the kind of arithmetic that should not live in a spreadsheet you update by hand.
