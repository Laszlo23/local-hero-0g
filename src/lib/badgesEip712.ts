/**
 * EIP-712 typed data for Local Hero badge contracts (`contracts/src/LocalHeroBadges.sol`).
 * Use with `signTypedData` (viem / wagmi) from the backend signer wallet with `SIGNER_ROLE`.
 */
export const BADGES_EIP712_NAME = "LocalHeroBadges";
export const BADGES_EIP712_VERSION = "1";

export const mintVoucherTypes = {
  MintVoucher: [
    { name: "minter", type: "address" },
    { name: "badgeId", type: "uint256" },
    { name: "amount", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const;

/** Soulbound identity — `contracts/src/LocalHeroSoulboundIdentity.sol` */
export const IDENTITY_EIP712_NAME = "LocalHeroSoulboundIdentity";
export const IDENTITY_EIP712_VERSION = "1";

export const claimVoucherTypes = {
  ClaimVoucher: [
    { name: "claimer", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const;
