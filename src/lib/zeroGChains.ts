import { defineChain } from "viem";

const DEFAULT_TESTNET_RPC = "https://evmrpc-testnet.0g.ai";
const DEFAULT_MAINNET_RPC = "https://evmrpc.0g.ai";

/** 0G Galileo testnet — see https://docs.0g.ai/developer-hub/testnet/testnet-overview */
export const ogGalileoTestnet = defineChain({
  id: 16602,
  name: "0G Galileo Testnet",
  nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
  rpcUrls: {
    default: { http: [import.meta.env.VITE_0G_RPC_TESTNET || DEFAULT_TESTNET_RPC] },
  },
  blockExplorers: {
    default: { name: "0G Galileo Explorer", url: "https://chainscan-galileo.0g.ai" },
  },
});

/** 0G mainnet — see https://docs.0g.ai/developer-hub/mainnet/mainnet-overview */
export const ogMainnet = defineChain({
  id: 16661,
  name: "0G",
  nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
  rpcUrls: {
    default: { http: [import.meta.env.VITE_0G_RPC_MAINNET || DEFAULT_MAINNET_RPC] },
  },
  blockExplorers: {
    default: { name: "0G Chain Explorer", url: "https://chainscan.0g.ai" },
  },
});

export function getDefault0gChain() {
  const network = (import.meta.env.VITE_0G_NETWORK || "testnet").toLowerCase();
  return network === "mainnet" ? ogMainnet : ogGalileoTestnet;
}

export function getSupported0gChains() {
  return [getDefault0gChain()];
}
