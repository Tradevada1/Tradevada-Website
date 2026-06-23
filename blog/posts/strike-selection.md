---
title: Strike selection: how delta, DTE, and your account size pick the strike for you
slug: strike-selection
description: The right strike isn't the one with the highest premium. It's the one that matches your conviction, your account, and how much pain you can stand at assignment.
date: 2026-06-12
tag: Options Education
read_minutes: 7
hero_image: /img/blog/strike-selection.jpg
---

Picking a strike is where most option traders make their real money - or quietly lose it.

The chain shows you dozens of strikes per expiration. Each has a different premium, a different probability of being in-the-money, and a different consequence if it is. The strike you pick is the strategy.

## Start with delta

Delta isn't just price sensitivity - it's an approximation of the option's probability of finishing in-the-money. Use it as your assignment-probability gauge.

| Delta | ~Probability of ITM at expiration | Use case |
|---|---|---|
| 0.10 | ~10% | Income-focused, low-touch wheel |
| 0.20 | ~20% | Conservative wheel sweet spot |
| 0.30 | ~30% | Standard wheel, balanced premium |
| 0.40+ | ~40%+ | Aggressive - you want assignment |

For cash-secured puts where you'd be happy to own the stock, **0.20-0.30 delta** is the most common range. You collect meaningful premium without making assignment a coin flip.

## Then layer in DTE (days to expiration)

Time matters as much as strike. Two general approaches:

**Weekly options (5-10 DTE)**
- Higher annualized return on premium
- Less time for the stock to move against you
- More commissions and management overhead
- Theta accelerates hard in the final week - your friend or your enemy depending on direction

**Monthly options (30-45 DTE)**
- The "sweet spot" most sellers prefer
- Theta is meaningful but not vicious
- Plenty of time to manage if things go wrong
- Roughly half the trading frequency = half the decisions = often better outcomes

The 45-DTE rule comes from tastytrade research that showed it as roughly the optimal balance of theta decay to ongoing time risk. Whether that's literally optimal or not, it's a defensible default.

## Account size sets your ceiling

This is where most retail traders mess up. You see a $200 premium for one contract on a $200 stock and think "free money." You're forgetting that one contract = 100 shares = $20,000 of potential exposure.

Before picking the strike, ask: **if assigned, can I actually afford to own 100 shares of this stock?**

- $5,000 account → strike under $50, period.
- $10,000 account → up to $100 strike, but only one contract at a time
- $25,000 account → flexibility up to $250 strikes, multiple contracts
- $50,000+ → start looking at portfolio-level concentration risk

The premium dollar amount looks the same, but the consequence isn't. A $200 credit on a $50 stock is great. A $200 credit on a $400 stock is catastrophic if assignment hits and your account can't absorb the shares.

## The IV rank multiplier

Once you know your delta target and DTE, IV rank tells you whether to actually pull the trigger.

- IV rank < 30 → premium is thin. The same delta strike pays half as much. Consider waiting.
- IV rank 30-70 → normal environment. Trade your plan.
- IV rank > 70 → premium is rich. You can pick lower delta and still collect meaningful credit, OR keep delta the same and pocket extra.

This is the single biggest "free edge" most retail premium sellers miss. Same strike, same strategy, totally different outcome depending on when you opened the trade.

## A worked example

You want to wheel SOFI. Stock at $22. $10,000 account.

Step 1: Account math. One contract = 100 shares × $22 = $2,200. That's 22% of your account on a single position. Acceptable for one trade.

Step 2: Pick your strike. Look for 0.25 delta in the 30-45 DTE range. Maybe that's the $20 strike at 35 DTE, premium $0.65.

Step 3: IV check. If SOFI's IV rank is 60+, the $0.65 is justified. If IV rank is 15, premium is light - wait or move down to 0.20 delta.

Step 4: Worst-case. If assigned at $20, your basis is $19.35 (strike minus premium). Sell covered calls at $22 next cycle. You're effectively buying a stock you wanted at a discount.

## The strike you should NEVER pick

The "money for nothing" strike: deep OTM with a $0.05 premium because "it's almost free money, what could go wrong?"

What goes wrong: a fat-tail event - earnings shock, sector collapse, single-day crash - sweeps through that "impossible" strike. You collected $5 in premium and absorbed a $500 loss.

The math of these trades: most weeks you bank $5. Once a year you lose $500. Net: you're underwater and you didn't enjoy a single trade along the way.

The premium has to compensate for the risk. If it doesn't, the strike isn't conservative - it's a deferred lottery ticket on your account.
