# Mobile Week 3: deep links, auth flow, and critical-path QA

This repo now includes native deep-link handling for Capacitor builds.

## Implemented in code

- `@capacitor/app` plugin added.
- `src/components/DeepLinkHandler.tsx`:
  - listens to `getLaunchUrl()` and `appUrlOpen`
  - parses URLs and routes safely via allowlist
- `src/lib/deepLink.ts`:
  - converts custom scheme and app links into internal routes
  - rejects unknown/unsafe paths
- `src/lib/deepLink.test.ts`:
  - parser tests for custom scheme, query, app link, and unsafe URLs
- `src/pages/DeepLinkDebug.tsx`:
  - in-app simulator route: `/app/deep-link-debug`
  - available in dev builds (or when `VITE_ENABLE_MOBILE_DEBUG=true`)
  - validates raw URL -> parsed route -> navigate
- `src/pages/AuthFlowDebug.tsx`:
  - route: `/app/auth-flow-debug`
  - shows Privy + AuthContext state, token retrieval, `/me/access-status` result
  - shows last deep-link event recorded by `DeepLinkHandler`
  - includes **Export diagnostics** (share sheet -> clipboard -> file fallback)

## Supported deep-link formats

- Custom scheme:
  - `localhero://app/redeem`
  - `localhero://app/ar?quest=park-nature-walk`
- App link / universal link (placeholder host):
  - `https://app.localhero.space/report-spot`

## Required platform follow-up

### Android

- Verify `AndroidManifest.xml` app link host matches production domain.
- Host `/.well-known/assetlinks.json` for app links verification.

### iOS

- Add Associated Domains entitlement (`applinks:...`) in Xcode project.
- Host `/.well-known/apple-app-site-association`.

## Week 3 QA checklist (must-pass)

- [ ] Open app from `localhero://app/redeem` -> lands on `/app/redeem`.
- [ ] Open app from `localhero://app/ar?quest=...` -> loads target quest.
- [ ] Open app from universal/app link -> route resolves correctly.
- [ ] Login persists after background/foreground on iOS and Android.
- [ ] Auth + onboarding route transitions have no blank screens.
- [ ] Critical flows pass on real devices:
  - [ ] `/app/redeem`
  - [ ] `/report-spot`
  - [ ] `/app/ar`
  - [ ] `/app/create-edu-quest`

## Debug tips

- Use `CAPACITOR_DEV_SERVER_URL=http://<LAN_IP>:8080` for quick iteration.
- If deep links fail, inspect:
  - parsed route from `parseDeepLinkToRoute()`
  - platform logs (Xcode/Logcat)
  - association files and domain verification status.

