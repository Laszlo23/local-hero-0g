# Mobile Week 3 QA matrix

Use this matrix during TestFlight/Play internal testing for deep-link and auth stability.

## Devices (minimum set)

- iOS:
  - iPhone 12/13 (stable iOS release)
  - iPhone 15+ (latest iOS)
- Android:
  - Pixel (latest Android)
  - Samsung mid-range device
  - Low-memory Android device

## Scenarios

| Area | Case | Expected |
|------|------|----------|
| Deep link | `localhero://app/redeem` cold start | App opens to `/app/redeem` |
| Deep link | `localhero://app/ar?quest=park-nature-walk` warm app | Route switches to educational AR view |
| Deep link | `https://app.localhero.space/report-spot` | Opens app and resolves to `/report-spot` |
| Deep link callback | `...?redirectTo=/app/profile` | Redirect route honored |
| Deep link callback | `https://.../#/app/redeem` | Hash route honored |
| Auth | Login then background/foreground x3 | Session intact, no blank screen |
| Auth | Sign out then deep link to protected route | Redirect to auth/onboarding flow |
| Auth | `/app/auth-flow-debug` -> run checks | Token and `/me/access-status` return expected values |
| Auth debug export | Export diagnostics | Share sheet or clipboard/file fallback works |
| Critical flow | `/app/redeem` | Loads points/redeem config and handles errors |
| Critical flow | `/report-spot` | Public submit succeeds or clear error shown |
| Critical flow | `/app/create-edu-quest` | AI generate/save and publish toggle works |

## Network conditions

- Wi-Fi stable
- 4G/5G moderate latency
- intermittent connection (toggle airplane mode during load)

Expected behavior:
- no hard crash
- clear loading/error states
- user can retry from UI

## Crash + log collection

For every failure:

1. Capture steps, device model, OS version.
2. Open `/app/auth-flow-debug` and use **Export diagnostics**.
3. Attach diagnostics JSON to bug ticket.
4. Include deep-link URL used (if applicable).

