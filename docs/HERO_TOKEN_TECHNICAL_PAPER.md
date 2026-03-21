# HERO Token — Technical Paper

**Version 1.0 · March 2026**

---

## Abstract

HERO is the ERC-20 utility token for the Local Hero ecosystem on **0G Chain**. Supply is **hard-capped at 77,777,777 HERO** (18 decimals). No contract path exists to mint beyond this cap. Governance, treasury, and liquidity are designed for **transparent, community-aligned control**—including multisig administration, separation of minting keys, and **locked liquidity** on decentralized exchanges. This document describes the token mechanics, security model, and recommended operational practices.

---

## 1. Token specification

| Field | Value |
|-------|--------|
| **Name** | Hero Token |
| **Symbol** | HERO |
| **Decimals** | 18 |
| **Standard** | ERC-20 (OpenZeppelin) |
| **Maximum supply** | **77,777,777** HERO (fixed, on-chain) |
| **Minting** | Only addresses holding `MINTER_ROLE`; mints **cannot** exceed `MAX_SUPPLY` |

The canonical implementation is `HeroToken.sol` in this repository. `MAX_SUPPLY` is a **public immutable constant** enforced in the `mint` function.

---

## 2. Contract security model

### 2.1 Inflation resistance

- **Hard cap**: `totalSupply() + amount ≤ MAX_SUPPLY` is enforced on every mint; otherwise the transaction reverts with `MaxSupplyExceeded`.
- **No owner mint bypass**: There is no privileged “reserve mint” or hidden supply; the only inflation path is `mint` through `MINTER_ROLE`, still subject to the cap.

### 2.2 Access control

- **`DEFAULT_ADMIN_ROLE`**: Can grant or revoke `MINTER_ROLE`. Should be held by a **Gnosis Safe (multisig)** on mainnet, not an EOA.
- **`MINTER_ROLE`**: Used for operational minting (e.g. points redemption). Should be a **dedicated hot wallet** with minimal native gas funding, **not** the multisig—so day-to-day redemptions do not require multisig signatures.

### 2.3 Upgradeability

The shipped `HeroToken` is **not** a proxy; the implementation is fixed at deployment. Changing logic requires a **new deployment** and migration—reducing governance bait-and-switch risk.

---

## 3. Multisig governance (recommended deployment)

1. **Deploy** `HeroToken` with `admin =` your **Gnosis Safe** address (or transfer `DEFAULT_ADMIN_ROLE` to the Safe immediately after deploy).
2. **Grant `MINTER_ROLE`** to the operational minter address via Safe transaction.
3. **Revoke `MINTER_ROLE`** from any EOA that should not mint (e.g. deployer), if applicable.
4. **Document** Safe signers, threshold, and chain (0G testnet vs mainnet) in your runbook.

This separates **policy** (who may mint) from **execution** (automated mints for users).

---

## 4. Liquidity and “unruggable” design

“Unruggable” in practice combines **(a)** capped supply, **(b)** **locked** liquidity pool (LP) tokens, and **(c)** transparent treasury/multisig control—not a single Solidity keyword.

### 4.1 DEX liquidity

- Bootstrap **HERO / WETH (or native wrapper)** liquidity on an AMM deployed on 0G (e.g. Uniswap V2–compatible pools, subject to what is live on the chain).
- **Send LP tokens** not to an EOA wallet but to:
  - A **time-lock** or **vesting** contract, **or**
  - A **community-trusted LP locker** (e.g. Team Finance, Uncx, or chain-native lockers), **or**
  - The **multisig** with a **public commitment** to lock for a minimum period (e.g. 12–24 months).

### 4.2 Why this matters

Locked LP prevents the team from **removing liquidity** in one transaction (“rug pull”). Pair with **public lock duration** and **block explorer** verification.

### 4.3 Treasury

Allocate treasury HERO from the **mint cap** via multisig-approved distributions (grants, ecosystem, listings). Never rely on unchecked EOA custody for large tranches.

---

## 5. Points redemption (off-chain ledger)

Users earn **HERO points** in the app; redemption converts points to on-chain HERO via a backend with `MINTER_ROLE`. Each mint is bounded by:

- User’s **available points** (server ledger), and  
- **Global** `remainingMintable()` on the token.

If the cap is reached, mints revert until governance deploys a successor token or new program—**no silent inflation**.

---

## 6. Threat model and mitigations

| Risk | Mitigation |
|------|------------|
| Unlimited mint | `MAX_SUPPLY` enforced in contract |
| Admin key theft | Multisig + hardware signers; minimal hot minter |
| Liquidity removal | LP locked or held under multisig + public lock |
| Backend compromise | Rate limits, monitoring, optional daily mint caps (off-chain), incident runbooks |
| Regulatory | Not covered here; obtain appropriate legal review |

---

## 7. Deployment checklist

- [ ] Deploy `HeroToken` with multisig as admin (or transfer admin to Safe).
- [ ] Grant `MINTER_ROLE` only to operational minter; fund minter with 0G native gas.
- [ ] Verify contract on block explorer; publish ABI.
- [ ] Add liquidity; **lock LP**; publish lock tx hashes.
- [ ] Configure API env: `HERO_TOKEN_ADDRESS`, `HERO_TOKEN_MINTER_PRIVATE_KEY`, RPC.
- [ ] Run DB migrations for redemption ledger.

---

## 8. Disclaimer

This paper is for **technical and operational transparency** only. It is **not** investment, legal, or tax advice. Token programs may be regulated in your jurisdiction. Smart contracts carry inherent risk; **third-party audits** are recommended before material value is at stake.

---

## References

- OpenZeppelin Contracts — ERC-20, AccessControl  
- Gnosis Safe — multisig wallets  
- Local Hero repo — `contracts/src/HeroToken.sol`, `docs/POINTS_AND_TOKENS.md`
