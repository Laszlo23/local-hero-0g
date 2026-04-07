# Deployments register

> **Grant / audit note:** Contract rows below use **`0x…` placeholders** until you deploy and paste **real addresses**. Reviewers verify claims via explorer links—fill this file (or attach the same table in your application) **immediately after** a successful testnet or mainnet deploy.

Use this table to record **verifiable** contract and infrastructure references for audits, grants, and handoffs.

| Network | Component | Address / identifier | Verified explorer / link | Date (ISO) | Notes |
|---------|-----------|----------------------|----------------------------|------------|--------|
| 0G Galileo (16602) | `HeroToken` | `0x…` | https://chainscan-galileo.0g.ai/address/0x… | | Replace `0x…` + path after deploy |
| 0G Galileo (16602) | `LocalHeroBadges` | `0x…` | | | |
| 0G Galileo (16602) | `LocalHeroSoulboundIdentity` | `0x…` | | | |
| 0G Mainnet (16661) | `HeroToken` | | | | When live |
| 0G Mainnet (16661) | `LocalHeroBadges` | | | | |
| 0G Mainnet (16661) | `LocalHeroSoulboundIdentity` | | | | |

### Environment / off-chain (optional rows)

| Item | Value / URL | Notes |
|------|-------------|--------|
| Public API base | | e.g. `PUBLIC_API_BASE_URL` for avatar links |
| Staging app | | PWA / web URL for demos |
| Quest-draft AI base URL | | OpenAI-compatible base (see `server/src/aiQuestDraft.ts`: `{OG_AI_API_URL}/chat/completions`); redact secrets—list host only |
| 0G Compute inference | | If using 0G Compute, list API base host here (milestone for grants) |

## How to fill after deploy

1. Deploy with Foundry per [`contracts/README.md`](../contracts/README.md) (e.g. `script/Deploy.s.sol`) with **`--broadcast`** on the target RPC (Galileo `16602` or mainnet `16661`).
2. Find JSON under **`contracts/broadcast/Deploy.s.sol/<chainId>/run-latest.json`** (or the latest `run-*.json`). Each `transactions` entry with `contractAddress` is a deployed contract—map names using your script’s deployment order or `contractName` fields if present.
3. Open each address on the correct explorer:
   - Testnet: [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai)
   - Mainnet: [chainscan.0g.ai](https://chainscan.0g.ai)
4. Use **Verify contract** on the explorer if the program expects verified source.
5. Commit updates to this file and reference it from [`docs/0G_ECOSYSTEM_GRANT.md`](0G_ECOSYSTEM_GRANT.md).

### Quick address extraction (optional)

If `jq` is installed and `run-latest.json` exists for chain `16602`:

```bash
jq -r '.transactions[] | select(.contractAddress != null) | "\(.contractName // "unknown")\t\(.contractAddress)"' \
  contracts/broadcast/Deploy.s.sol/16602/run-latest.json
```

Adjust the path if your script name or chain id differs.
