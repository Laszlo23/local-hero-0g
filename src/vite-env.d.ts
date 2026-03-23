/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRIVY_APP_ID?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_MOBILE_DEBUG?: string;
  /** `testnet` (Galileo) or `mainnet` */
  readonly VITE_0G_NETWORK?: string;
  readonly VITE_0G_RPC_TESTNET?: string;
  readonly VITE_0G_RPC_MAINNET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
