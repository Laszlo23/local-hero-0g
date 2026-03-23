# Mobile Week 2 setup (Capacitor bootstrap)

This document captures what is configured in-repo for the Week 2 mobile milestone.

## What is already done

- Capacitor initialized:
  - `capacitor.config.ts`
  - app id: `space.localhero.app`
  - app name: `Local Hero`
  - web dir: `dist`
- Native projects added:
  - `ios/`
  - `android/`
- Package scripts added:
  - `mobile:sync`, `mobile:copy`
  - `mobile:ios`, `mobile:android`
  - `mobile:run:ios`, `mobile:run:android`
- Android baseline:
  - custom-scheme deep link: `localhero://...`
  - app-link placeholder: `https://app.localhero.space/...`
  - network security config for localhost/dev cleartext
- iOS baseline:
  - custom URL scheme: `localhero`
  - camera and location usage descriptions
  - local networking ATS allowance for dev server mode

## Commands

```sh
# Build and sync native projects
npm run mobile:sync

# Open in IDEs
npm run mobile:ios
npm run mobile:android
```

Environment sync profiles:

```sh
npm run mobile:sync:dev
npm run mobile:sync:staging
npm run mobile:sync:prod
```

### Optional local live reload

```sh
CAPACITOR_DEV_SERVER_URL=http://<your-lan-ip>:8080 npm run mobile:ios
CAPACITOR_DEV_SERVER_URL=http://<your-lan-ip>:8080 npm run mobile:android
```

## Before production submit

1. Replace app-link host in `AndroidManifest.xml` with final domain.
2. Add Apple Associated Domains entitlement for universal links.
3. Tighten Android `network_security_config.xml` (remove cleartext if not needed).
4. Review iOS permission wording for legal/product fit.
5. Add final app icons/splash assets for both platforms.

## Android flavors (Week 2.3)

Configured in `android/app/build.gradle`:

- `dev` -> `applicationIdSuffix ".dev"` (`Local Hero Dev`)
- `staging` -> `applicationIdSuffix ".staging"` (`Local Hero Staging`)
- `prod` -> no suffix (`Local Hero`)

Build commands:

```sh
npm run mobile:android:assemble:dev
npm run mobile:android:assemble:staging
npm run mobile:android:assemble:prod
```

Generated artifacts are in `android/app/build/outputs/apk/` (or AAB when using bundle tasks).

## Known notes

- `mobile:sync` runs `vite build`, which can emit dependency warnings from third-party packages (e.g. Privy). This is expected in current setup and does not block sync.

