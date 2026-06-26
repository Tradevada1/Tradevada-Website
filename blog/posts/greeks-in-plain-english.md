---
title: Understanding the Greeks: Delta, Theta, Gamma, Vega in plain English
slug: greeks-in-plain-english
description: Four numbers that tell you how an option will move. What they actually measure, how to read them as risk, and which one matters most for the strategy you're running.
date: 2026-06-12
tag: Options Education
read_minutes: 6
hero_image: /img/blog/greeks-in-plain-english.jpg
---

An option has a price, but it also has sensitivities. How much does the option price move when the stock moves a dollar? When a day passes? When volatility changes?

Those sensitivities are the Greeks. Four numbers tell you almost everything about what your position will do next.

## Delta: how much does the option move when the stock moves?

Delta is a number between -1 and 1 that tells you how much the option's price will change for every $1 move in the stock.

- A call with **delta 0.50** means: stock goes up $1, the call goes up roughly $0.50.
- A put with **delta -0.30** means: stock goes up $1, the put goes down $0.30.

> **Quick rule:** delta also approximates the option's chance of finishing in-the-money. Delta 0.30 → roughly 30% chance of expiring ITM.

For premium sellers, delta tells you your "share equivalent" exposure. A 0.30-delta short put behaves a lot like being long 30 shares of the underlying.

## Theta: how much does the option lose per day?

Theta is the daily decay. It's the amount the option's value bleeds out just from time passing, all else equal.

- A long option has **negative theta**. You're losing value every day.
- A short option (sold) has **positive theta**. Time decay works in your favor.

Theta accelerates as expiration approaches. The last two weeks are where decay is fiercest - which is exactly when premium sellers want to hold positions.

This is why "selling premium" makes money in flat markets. The clock is on your side.

## Gamma: how fast does delta change?

Gamma is the rate of change of delta. As the stock moves, delta shifts - and gamma tells you how fast.

- Options at-the-money have the **highest gamma**. A small stock move flips delta meaningfully.
- Options deep ITM or far OTM have **low gamma**. Their deltas barely move.

Gamma is what makes "near-the-money + near-expiration" so explosive in either direction. A short straddle on the day of expiration is a lot of gamma sitting in your account. Small move in the wrong direction = your delta swings hard against you.

## Vega: how much does the option respond to volatility?

Vega tells you what happens to the option price when implied volatility changes by 1%.

- Long options have **positive vega**. If IV spikes, the option gains value, even if the stock hasn't moved.
- Short options have **negative vega**. Your short premium suffers when volatility expands.

This is the hidden second engine for premium sellers. You want to sell when IV is rich (high), and hope for IV to contract (mean-revert lower) - which makes your short option cheaper to buy back.

## Which one matters most?

Depends on what you're trading:

| Strategy | Watch most |
|---|---|
| Buying calls/puts on direction | Delta, gamma |
| Selling cash-secured puts | Theta, vega |
| Selling covered calls | Theta, delta |
| Earnings plays | Vega (IV crush!) |
| 0DTE / weeklies | Gamma (explosive moves) |

For a wheel-style premium seller: **theta is your income**, **vega is your environment**, **delta is your risk**, **gamma is your warning light** as expiration nears.

## What to do with this

You don't need to calculate Greeks yourself - every brokerage shows them. The skill is reading them before you click "submit."

Before opening any options position, look at the four numbers. Ask: which one is helping me, which one is fighting me? Is theta my friend today or my enemy? Is IV rich enough to justify the trade?

If you can answer those four questions, you're already trading better than most retail.
