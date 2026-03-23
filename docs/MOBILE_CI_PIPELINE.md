# Mobile CI pipeline (GitHub Actions)

This repo includes a mobile CI scaffold: **`.github/workflows/mobile-ci.yml`**.

## What it does

### 1) `web-sanity` job

- `npm ci`
- `npm test`
- `npm run build`

Ensures web/test baseline passes before native flavor builds.

### 2) `android-flavors` matrix job

Builds three Android flavors in parallel:

- `dev`
- `staging`
- `prod`

Per flavor:

1. Installs Node + JDK 17
2. Runs flavor-specific Capacitor sync:
   - `mobile:sync:dev`
   - `mobile:sync:staging`
   - `mobile:sync:prod`
3. Runs flavor APK build:
   - `mobile:android:assemble:dev`
   - `mobile:android:assemble:staging`
   - `mobile:android:assemble:prod`
4. Uploads APK artifacts from `android/app/build/outputs/apk/**`

### 3) `ios-simulator` job

Builds an unsigned iOS simulator app on macOS:

1. `npm ci`
2. `npm run mobile:sync:dev`
3. `npm run mobile:ios:build:sim`
4. Zips `App.app` into `App-simulator.zip`
5. Uploads artifact (`ios-simulator-app`)

This lane validates iOS project integrity in CI without signing credentials.

### 4) `ios-testflight` job (manual)

Creates a signed iOS archive/IPA and uploads to TestFlight:

1. Runs only on manual trigger (`workflow_dispatch`).
2. Runs `npm run mobile:sync:prod`.
3. Resolves iOS version/build:
   - from workflow inputs (`ios_version_name`, `ios_build_number`) when provided
   - else from tag `vX.Y.Z` for version name
   - else fallback to run-number-based values
4. Imports signing certificate into keychain.
5. Installs provisioning profile from secret.
6. Archives and exports IPA using manual signing config.
7. Uploads IPA as CI artifact.
8. Uploads IPA to TestFlight using App Store Connect API key.

Required repository secrets:

- `IOS_P12_BASE64` (base64 `.p12` signing cert)
- `IOS_P12_PASSWORD`
- `IOS_PROVISIONING_PROFILE_BASE64` (base64 `.mobileprovision`)
- `IOS_PROVISIONING_PROFILE_UUID`
- `IOS_TEAM_ID`
- `IOS_CODE_SIGN_IDENTITY` (example: `Apple Distribution`)
- `IOS_BUNDLE_IDENTIFIER` (example: `space.localhero.app`)
- `ASC_API_KEY_ID`
- `ASC_API_ISSUER_ID`
- `ASC_API_PRIVATE_KEY_BASE64` (base64 content of `AuthKey_*.p8`)

Manual dispatch examples:

- Input-driven: `ios_version_name=1.4.0`, `ios_build_number=140`
- Tag-driven: run from `v1.5.0` and omit iOS inputs

### 5) `android-signed-release` matrix job (manual)

Builds signed Android App Bundles (AAB) for:

- `staging`
- `prod`

Behavior:

1. Runs only on manual trigger (`workflow_dispatch`).
2. Runs only when signing secrets are configured.
3. Decodes keystore from Base64 secret into `android/app/release.keystore`.
4. Exports signing env vars for Gradle signing config.
5. Sets release version env vars:
   - If workflow inputs are provided:
     - `android_version_name` -> `ANDROID_VERSION_NAME`
     - `android_version_code` -> `ANDROID_VERSION_CODE`
   - Else if run from tag like `v1.2.3`:
     - `ANDROID_VERSION_NAME=1.2.3`
     - `ANDROID_VERSION_CODE=${{ github.run_number }}`
   - Else fallback:
     - `ANDROID_VERSION_NAME=1.0.${{ github.run_number }}`
     - `ANDROID_VERSION_CODE=${{ github.run_number }}`
6. Runs flavor bundle tasks:
   - `mobile:android:bundle:staging`
   - `mobile:android:bundle:prod`
7. Uploads signed AAB artifacts from `android/app/build/outputs/bundle/**`.

`android/app/build.gradle` reads these optional env vars:

- `ANDROID_VERSION_CODE` (integer, defaults to `1`)
- `ANDROID_VERSION_NAME` (string, defaults to `1.0`)

This keeps release artifacts uniquely versioned in CI without manual file edits.

Manual dispatch examples:

- Version by input: set `android_version_name=1.4.0`, `android_version_code=140`
- Version by tag: trigger from tag `v1.5.0` and omit inputs

Required repository secrets:

- `ANDROID_KEYSTORE_BASE64` (base64-encoded `.jks`/`.keystore`)
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

### 6) `android-play-internal` matrix job (manual)

Publishes signed AABs to Google Play **internal** track for:

- `staging`
- `prod`

Behavior:

1. Runs only on manual trigger (`workflow_dispatch`).
2. Waits for `android-signed-release` to complete.
3. Downloads signed flavor artifact (`android-<flavor>-signed-aab`).
4. Uses Play service account JSON secret for API auth.
5. Uploads AAB to internal track with `status: draft` (safe default).

Required repository secrets:

- `PLAY_SERVICE_ACCOUNT_JSON` (raw JSON content, not base64)
- `PLAY_PACKAGE_NAME_STAGING` (example: `space.localhero.app.staging`)
- `PLAY_PACKAGE_NAME_PROD` (example: `space.localhero.app`)

## Triggers

- Pull requests targeting `main` / `master`
- Manual trigger (`workflow_dispatch`)

## Next recommended upgrades

1. Promote Play uploads from `draft` to controlled rollout automation.
2. Add branch/path filters to reduce unnecessary runs.
3. Add semver/tag-driven release versioning for Play `versionCode`.
4. Add environment-specific iOS bundle ids / profiles (staging vs prod).
5. Add provenance/SBOM artifact generation for release compliance.

