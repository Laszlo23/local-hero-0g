# Points → tokens (planned direction)

## Product intent

- **HERO points** stay the primary in-app reward (quests, drops, referrals, etc.) so participation does not require wallet complexity for every action.
- **Token exchange** is a **later layer**: users who want tradable value convert points into on-chain tokens under rules you define (rate, limits, seasons).

This document captures alignment only; **no automated swap is implemented in this repo yet**.

## Why this shape

| Layer | Role |
|-------|------|
| Points | Fast iteration, anti-abuse, game balance, optional off-chain ledger |
| Tokens | Transferable value, DEX liquidity, composability with 0G / wallets |

## When building the bridge (checklist)

- Conversion **formula** (fixed rate, decaying rate, or oracle).
- **Caps** per user / per day; **cooldowns**; eligibility (e.g. KYC / region if required).
- **Token source**: treasury allocation, mint schedule, or market operations.
- **Smart contracts** (0G): mint/transfer to user wallet, or claim contract with signature.
- **Compliance**: treat as financial product in relevant jurisdictions; get legal review before launch.

## Related code today

- Points awarding: `src/lib/points.ts`, discovery/storm claim flows.
- On-chain badges / identity: `contracts/` (separate from points; can be linked later via eligibility or burns).

Update this file when the exchange mechanism is specified or shipped.
