---
title: Volatility cycles: VIX, IV rank, and when to sell premium vs. buy it
slug: volatility-cycles
description: Volatility moves in cycles. Knowing where you are in the cycle determines whether selling premium is genius or career-ending.
date: 2026-06-12
tag: Market Trends
read_minutes: 8
hero_image: /img/blog/volatility-cycles.jpg
---

Implied volatility is the single most important variable for any option seller. Get it right, and time + IV crush do the work for you. Get it wrong, and you're picking up nickels in front of a steamroller.

This article covers the cycle: how volatility moves, how to measure it, and when to lean in versus when to wait.

## What volatility actually is

Implied volatility (IV) is the market's best guess at how much a stock will move in the future. It's baked into option prices. High IV = expensive options. Low IV = cheap options.

Two things drive IV:

1. **Realized volatility** (how much the stock has actually been moving)
2. **Expected events** (earnings, FDA approvals, Fed meetings) that could cause big moves

Most retail traders look at the VIX as a proxy for "market volatility." That's correct as far as it goes, but the VIX is specifically the 30-day implied volatility on SPX options. It's a market-wide thermometer, not a single-stock gauge.

## The volatility cycle

Vol moves in cycles. Here's the typical four-phase pattern:

| Phase | VIX range | What's happening | What to do |
|---|---|---|---|
| Calm | 12-15 | Stocks grinding up, low fear | Sell premium with high probability strikes |
| Building | 15-20 | Headlines creep in, two-way action | Be selective, shorter DTE, smaller size |
| Spike | 20-35+ | Crisis or correction | STOP selling. Don't catch the falling knife. |
| Decay | 35→15 | Crisis fades, IV mean-reverts | Best premium-selling environment of the cycle |

The mistake most traders make: they sell aggressively in Phase 1 (low IV = low premium, terrible risk/reward), then panic and stop selling in Phase 4 (high IV = expensive premium, exactly when you should lean in).

## IV rank: the metric that fixes this

Absolute IV is misleading. A stock at 35% IV could be at the top or bottom of its annual range.

**IV rank** normalizes it. It tells you where current IV sits within the past year's range.

- IV rank 100 = today's IV is at the 12-month high
- IV rank 50 = today's IV is at the middle of the 12-month range
- IV rank 0 = today's IV is at the 12-month low

For premium sellers, you want IV rank above 50. The higher, the better.

Above 80 is "back up the truck" territory — assuming the stock isn't about to crash through your strike.

## The "sell when high, buy when low" rule

Premium sellers profit when:
- Time passes (theta decay)
- IV contracts (vega works in your favor)

So you want to OPEN positions when IV is high (you collect rich premium), and either let them expire or buy them back when IV has contracted (you keep most of the premium).

The opposite is true for premium buyers. If you're buying long calls or puts:
- IV rank below 30 is where you want to enter (cheap optionality)
- IV rank above 60 is brutal — the option has to make a big move just to overcome the implied volatility you paid

## The volatility skew you can't ignore

Index options like SPX have a permanent "skew" — out-of-the-money puts are pricier than out-of-the-money calls. Same distance from the money, different IV.

This is because crashes happen faster than rallies. Big institutional traders pay up for downside protection, which permanently pumps put prices.

For wheel strategy users, this is **a feature**. You're selling puts. The skew pumps your premium. You're getting paid more than a flat IV would suggest, for taking on a risk that mean-reverts.

For volatility traders: the put skew can suddenly compress (after a crash + recovery) or expand (during a Fed scare). Watching the skew change is a real edge.

## Specific tools to track

- **VIX** — market-wide 30-day SPX vol
- **VXN** — Nasdaq-100 equivalent (usually higher because tech moves more)
- **Term structure** — VIX9D vs VIX vs VIX3M. In normal times, longer-dated > shorter. In crisis, it inverts.
- **IV rank per ticker** — most brokerages and Tradevada show this on the option chain

The setup for premium sellers: high IV rank + normal-shaped term structure + a stock you don't mind owning at the strike. Hard to beat.

## When NOT to sell premium

Three setups to avoid:

1. **IV rank under 30** — premium is too low to compensate for the assignment risk
2. **Just before a binary event** (earnings, FDA decision, Fed) on a small account where one bad gap could hurt
3. **Right after a vol spike, when IV is still extending higher** — selling on the way up is catching a knife

The discipline isn't picking the right direction. It's knowing which environment rewards your strategy and which destroys it.
