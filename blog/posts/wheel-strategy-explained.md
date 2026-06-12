---
title: The Wheel Strategy, Explained Step by Step
slug: wheel-strategy-explained
description: Sell puts, take assignment, sell calls, repeat. How the wheel actually works, where the money comes from, and what can go wrong.
date: 2026-06-12
tag: Wheel Strategy
read_minutes: 8
hero_image: /img/blog/wheel-strategy-explained.jpg
---

The wheel is the rare options strategy that's easy to describe and hard to execute with discipline. You sell cash-secured puts on a stock you'd be happy to own. If you get assigned, you sell covered calls against the shares. If the shares get called away, you start over. Every turn of the wheel collects premium.

## Step one: sell a cash-secured put

Pick a stock you would genuinely hold — not just one with juicy premium. Sell a put at a strike below the current price and set aside the cash to buy 100 shares at that strike. Two things can happen: the option expires worthless and you keep the premium, or the stock drops below your strike and you buy shares at a price you already said you liked.

Most wheel traders sell 30–45 days out at roughly a 30-delta strike, then close early once most of the premium has decayed. The exact numbers matter less than writing your rules down and following them every time.

## Step two: take assignment without panicking

Assignment is not failure — it's the strategy working as designed. You now own 100 shares at an effective cost of strike minus all the premium you've collected. That effective cost basis is the single most useful number to track, because it tells you which covered-call strikes lock in a profitable cycle.

## Step three: sell covered calls until the shares leave

With shares in hand, sell calls at or above your effective cost basis. Each week or month of premium lowers your basis further. Eventually the stock rallies through your strike and the shares get called away — that's the wheel completing one full cycle, and the total profit is every premium collected plus any gain between your assignment price and the call strike.

## Where it goes wrong

The wheel loses money the same way owning stock loses money: the underlying falls hard and keeps falling. Premium softens the blow but doesn't repeal it. The most common self-inflicted wounds are wheeling stocks you'd never actually hold, sizing positions so big one assignment dominates your account, and selling calls below your cost basis after a drop — locking in a loss the moment the stock recovers.

Tracked honestly, a wheel cycle has a dozen numbers attached to it: every premium, the assignment, the basis, the exit. That arithmetic is exactly what a journal should do for you.
