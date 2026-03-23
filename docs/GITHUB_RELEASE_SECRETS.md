# GitHub release secrets checklist

Mobile release workflows read secrets from **GitHub Environments** (recommended) and/or **repository secrets**.

## Environments

| Environment            | When it’s used |
|------------------------|----------------|
| **`mobile-release`**   | Candidate / internal releases (`release_channel=candidate` in Launch Readiness, and Mobile CI signed Android). |
| **`production-release`** | Production channel (`release_channel=production`) and some high-risk Play actions. |

Jobs that reference an `environment:` block only see **environment secrets** for names stored on that environment, plus normal repository/org secrets (see [GitHub docs](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)).

**Important:** Android signed AAB jobs use `environment: mobile-release` or `production-release` so **`ANDROID_*` secrets should be added to the same environment** as Play/TestFlight — not only at repo level (unless you use repository secrets for everything).

## Required secret names

### Android signing (signed AAB)

Set on **`mobile-release`** (and **`production-release`** if you run prod channel without sharing secrets):

- `ANDROID_KEYSTORE_BASE64` — base64 of the `.jks` / keystore file  
- `ANDROID_KEYSTORE_PASSWORD`  
- `ANDROID_KEY_ALIAS`  
- `ANDROID_KEY_PASSWORD`  

### Google Play (optional upload jobs)

- `PLAY_SERVICE_ACCOUNT_JSON` — service account JSON (full JSON as secret value)  
- `PLAY_PACKAGE_NAME_STAGING` — application id for staging (e.g. `space.localhero.app.staging`)  
- `PLAY_PACKAGE_NAME_PROD` — application id for production  

### iOS + TestFlight (optional)

- `IOS_P12_BASE64`  
- `IOS_P12_PASSWORD`  
- `IOS_PROVISIONING_PROFILE_BASE64`  
- `IOS_PROVISIONING_PROFILE_UUID`  
- `IOS_TEAM_ID`  
- `IOS_CODE_SIGN_IDENTITY`  
- `IOS_BUNDLE_IDENTIFIER`  
- `ASC_API_KEY_ID`  
- `ASC_API_ISSUER_ID`  
- `ASC_API_PRIVATE_KEY_BASE64` — base64 of the App Store Connect API `.p8` private key  

## CLI: set one secret (prompts securely)

```bash
REPO="OWNER/REPO"   # e.g. Laszlo23/local-hero-0g
ENV="mobile-release"

gh secret set ANDROID_KEYSTORE_BASE64 --repo "$REPO" --env "$ENV"
# paste value, Ctrl-D
```

Repeat for each name above. Use `--env production-release` for production-only values if you split them.

## Verify

```bash
gh secret list --repo OWNER/REPO --env mobile-release
```

Names appear; values are never shown.

Then run **Launch Readiness** again (start with `run_play_upload=false` and `run_ios_testflight=false` if you only want builds until Play/ASC are ready).
