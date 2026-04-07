# Deployments register

Use this table to record **verifiable** contract and infrastructure references for audits, grants, and handoffs. Replace placeholders with real values after deploy.

| Network | Component | Address / identifier | Verified explorer / link | Date (ISO) | Notes |
|---------|-----------|----------------------|----------------------------|------------|--------|
| 0G Galileo (16602) | `HeroToken` | `0x…` | https://chainscan-galileo.0g.ai/address/0x… | | |
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
| Quest-draft AI base URL | | OpenAI-compatible; redact secrets—list host only |

### How to fill

1. Deploy with Foundry per [`contracts/README.md`](../contracts/README.md).  
2. Copy addresses from broadcast output; verify on the correct explorer.  
3. Commit updates to this file (or attach in grant application).
