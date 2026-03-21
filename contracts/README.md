# Local Hero — on-chain contracts

Foundry project for **HERO ERC-20 (points redeem)**, **achievement badges (ERC-1155)**, and an optional **soulbound Hero ID (ERC-721)** on any EVM chain (e.g. **0G Galileo testnet** `16602` or **0G mainnet** `16661`).

## Contracts

| Contract | File | Purpose |
|----------|------|---------|
| **HeroToken** | `src/HeroToken.sol` | ERC-20 **HERO** (18 decimals), **`MAX_SUPPLY` = 77,777,777**. Only **`MINTER_ROLE`** can `mint` (never beyond cap). Node API mints after deducting points (`POST /me/redeem`). Use a **multisig** for `DEFAULT_ADMIN_ROLE` in production. |
| **LocalHeroBadges** | `src/LocalHeroBadges.sol` | Multi-badge collection. Users **mint with an EIP-712 voucher** signed by a `SIGNER_ROLE` key (backend). **Agents** (`AGENT_ROLE`) mint for events. **Registrars** (`REGISTRAR_ROLE`) register badge types (metadata URI, max supply, soulbound flag). |
| **LocalHeroSoulboundIdentity** | `src/LocalHeroSoulboundIdentity.sol` | One non-transferable ERC-721 per address (`tokenId = uint256(uint160(wallet))`). Claim via signed voucher or `AGENT_ROLE`. |

### Product flow (badges)

1. **Off-chain**: user *earns* a badge in the app (quests, referrals, etc.).
2. **Backend**: issues a **MintVoucher** signature when the user is eligible.
3. **On-chain**: user submits `mintWithSignature(voucher, sig)` from their wallet — badge appears in the wallet only after this tx.
4. **Special events**: registrar registers a new `badgeId` + URI; agent calls `agentMint(recipient, badgeId, amount)` for drops.

### EIP-712 (`LocalHeroBadges`)

- **Domain**: `name = "LocalHeroBadges"`, `version = "1"`, `chainId`, `verifyingContract`.
- **MintVoucher** fields: `address minter`, `uint256 badgeId`, `uint256 amount`, `uint256 nonce`, `uint256 deadline`.
- **Nonces**: per-minter, exposed as `nonces(address)`.

### EIP-712 (`LocalHeroSoulboundIdentity`)

- **Domain**: `name = "LocalHeroSoulboundIdentity"`, `version = "1"`.
- **ClaimVoucher**: `address claimer`, `uint256 nonce`, `uint256 deadline`.

## Commands

```bash
cd contracts
forge install   # already vendored: openzeppelin-contracts, forge-std
forge build
forge test
```

### Deploy (example — 0G testnet)

```bash
cd contracts
export RPC_URL=https://evmrpc-testnet.0g.ai
forge script script/Deploy.s.sol:Deploy --rpc-url $RPC_URL --broadcast
```

The broadcast wallet becomes **admin** (grant `SIGNER_ROLE` to your backend key, `REGISTRAR_ROLE` to ops, `AGENT_ROLE` for event minters).

### ABIs

```bash
forge inspect LocalHeroBadges abi > ../artifacts/LocalHeroBadges.abi.json
forge inspect LocalHeroSoulboundIdentity abi > ../artifacts/LocalHeroSoulboundIdentity.abi.json
```

## Roles (AccessControl)

**LocalHeroBadges**

- `DEFAULT_ADMIN_ROLE` — pause, grant roles.
- `REGISTRAR_ROLE` — `registerBadgeType`, `setBadgeURI`.
- `SIGNER_ROLE` — addresses whose signature is accepted for `mintWithSignature` (typically hot backend key).
- `AGENT_ROLE` — `agentMint` for campaigns / one-offs.

**LocalHeroSoulboundIdentity**

- `DEFAULT_ADMIN_ROLE` — `setBaseURI`, pause, grant roles.
- `SIGNER_ROLE` — `claimWithSignature`.
- `AGENT_ROLE` — `agentMint`.
