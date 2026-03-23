import type { CapacitorConfig } from '@capacitor/cli';

const devServerUrl = process.env.CAPACITOR_DEV_SERVER_URL;
const appId = process.env.CAPACITOR_APP_ID || "space.localhero.app";
const appName = process.env.CAPACITOR_APP_NAME || "Local Hero";
const webDir = process.env.CAPACITOR_WEB_DIR || "dist";

const config: CapacitorConfig = {
  appId,
  appName,
  webDir,
  ...(devServerUrl
    ? {
        server: {
          url: devServerUrl,
          cleartext: true,
        },
      }
    : {}),
};

export default config;
