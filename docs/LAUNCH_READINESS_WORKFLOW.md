# Launch Readiness workflow

Use **`.github/workflows/launch-readiness.yml`** when you want one manual run that prepares launch outputs.

## What it runs

1. **Preflight quality gates**
   - `npm run lint`
   - `npm test`
   - `npm run build`
   - uploads web artifact (`web-dist`)

2. **Android signed AABs**
   - builds `staging` + `prod` signed AABs
   - uploads `android-<flavor>-signed-aab` artifacts

3. **iOS simulator sanity**
   - sync + unsigned simulator build
   - uploads simulator artifact

4. **Optional Android Play upload**
   - controlled by `run_play_upload`
   - supports `draft`, `inProgress`, `completed`
   - `completed` requires `play_completed_confirm=APPROVE_PLAY_COMPLETED`

5. **Optional iOS TestFlight upload**
   - controlled by `run_ios_testflight`
   - performs signed archive/export and uploads to TestFlight

## Required secrets

### Android signing
- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

### Play upload (if enabled)
- `PLAY_SERVICE_ACCOUNT_JSON`
- `PLAY_PACKAGE_NAME_STAGING`
- `PLAY_PACKAGE_NAME_PROD`

### iOS signing + App Store Connect (if enabled)
- `IOS_P12_BASE64`
- `IOS_P12_PASSWORD`
- `IOS_PROVISIONING_PROFILE_BASE64`
- `IOS_PROVISIONING_PROFILE_UUID`
- `IOS_TEAM_ID`
- `IOS_CODE_SIGN_IDENTITY`
- `IOS_BUNDLE_IDENTIFIER`
- `ASC_API_KEY_ID`
- `ASC_API_ISSUER_ID`
- `ASC_API_PRIVATE_KEY_BASE64`

## Recommended environment protection

- `mobile-release` for candidate releases
- `production-release` for production releases

Set required reviewers/wait timers on `production-release`.

## Troubleshooting

- **`npm ci` fails in Preflight with ERESOLVE / react-leaflet**  
  `react-leaflet` v5 expects React 19. This repo stays on React 18 and uses **`react-leaflet` ^4.2.x** so `npm ci` resolves cleanly in CI. If you upgrade to React 19, you can move back to v5.
