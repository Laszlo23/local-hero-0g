# Mobile launch plan (iOS + Android)

Concrete implementation backlog to ship Local Hero to **Apple App Store** and **Google Play** with the current React/Vite codebase.

## Scope and principle

- Keep web app as source of truth.
- Use **Capacitor** wrapper for native store builds.
- Add native capabilities only where needed (camera reliability, push, deep links).

---

## Week 1 — Foundation and decisions

### Deliverables

- Finalize architecture decision: **Capacitor + existing React app**.
- Create mobile app identifiers:
  - iOS bundle id
  - Android application id
- Draft release channels:
  - iOS: Dev -> TestFlight -> Production
  - Android: Internal -> Closed -> Production

### Tasks

- [ ] Create `mobile/decision-record.md` with architecture rationale.
- [ ] Reserve bundle IDs and app names in Apple/Google consoles.
- [ ] Set up shared product analytics event list (mobile + web consistent).
- [ ] Define minimum supported versions (iOS and Android).
- [ ] Define crash-free KPI target (e.g. 99.5% beta gate).

### Owners

- Tech lead, mobile owner, product owner.

---

## Week 2 — Capacitor bootstrap

### Deliverables

- Native projects generated and runnable locally.

### Tasks

- [ ] Install Capacitor in root project.
- [ ] Add `ios/` and `android/` projects.
- [ ] Configure app id, app name, web dir, server URLs for dev/prod.
- [ ] Add native splash/icon placeholders.
- [ ] Add `.env` mapping strategy for mobile builds.
- [ ] Add npm scripts for:
  - `mobile:sync`
  - `mobile:ios`
  - `mobile:android`

### Verification

- [ ] App boots on simulator/emulator.
- [ ] Core route loads (`/app`).

---

## Week 3 — Auth, deep links, and critical flows

### Deliverables

- Auth and route navigation stable in mobile shell.

### Tasks

- [ ] Test Privy login flow in WebView context.
- [ ] Configure deep links:
  - `localhero://...`
  - universal links (iOS)
  - app links (Android)
- [ ] Validate flows:
  - onboarding
  - `/app/redeem`
  - `/report-spot`
  - `/app/ar`
  - `/app/create-edu-quest`

### Verification

- [ ] Login/logout works repeatedly.
- [ ] Deep links open correct in-app route.

---

## Week 4 — Camera, QR, permissions hardening

### Deliverables

- Reliable camera/QR behavior across real devices.

### Tasks

- [ ] Define permission UX copy (camera/location/notifications).
- [ ] Test AR + QR on real iOS + Android devices.
- [ ] Add fallback path using Capacitor camera/scan plugin where web scanner fails.
- [ ] Add graceful denied-permission states with retry buttons.

### Verification

- [ ] Quest QR scans consistently on low-end Android.
- [ ] Camera permission denial/re-enable flow is recoverable.

---

## Week 5 — Notifications and engagement

### Deliverables

- Push notifications in beta.

### Tasks

- [ ] Integrate push provider (FCM/APNs abstraction).
- [ ] Add device token registration endpoint.
- [ ] Implement notification types:
  - quest reminders
  - class quest updates
  - redeem confirmations
- [ ] Add in-app notification settings screen.

### Verification

- [ ] End-to-end push test on iOS + Android physical devices.

---

## Week 6 — Observability and QA matrix

### Deliverables

- Production-grade monitoring + repeatable QA.

### Tasks

- [ ] Integrate crash reporting (e.g. Sentry/Firebase Crashlytics).
- [ ] Add release version tagging to frontend + API logs.
- [ ] Build QA matrix:
  - device models
  - OS versions
  - network conditions
  - auth state permutations
- [ ] Run smoke tests for all critical flows.

### Gate

- [ ] Crash-free rate and key funnel success above threshold.

---

## Week 7 — Store compliance package

### Deliverables

- Submission-ready metadata and policy docs.

### Tasks

- [ ] App Store Connect metadata:
  - screenshots
  - app description
  - keywords
  - support/privacy URLs
- [ ] Apple privacy nutrition labels completed.
- [ ] Play Console data safety completed.
- [ ] Legal review:
  - Terms
  - Privacy
  - token disclosures
  - school/children data stance
- [ ] Age rating questionnaires completed.

---

## Week 8 — Beta release and launch prep

### Deliverables

- External beta live + launch checklist signed off.

### Tasks

- [ ] Ship TestFlight external beta.
- [ ] Ship Play closed testing track.
- [ ] Collect bug reports and triage SLAs.
- [ ] Fix P0/P1 issues.
- [ ] Prepare launch comms + rollback plan.

### Launch gate checklist

- [ ] Auth stable
- [ ] AR/QR stable
- [ ] Redeem stable
- [ ] Report-a-spot stable
- [ ] Educational creator flow stable
- [ ] Crash-free KPI met
- [ ] Privacy/data safety approved

---

## Post-launch (first 30 days)

- Weekly releases with telemetry review.
- Measure:
  - day-1/day-7 retention
  - quest completion rates
  - creator draft -> publish conversion
  - redeem conversion and failure rate
- Prioritize native improvements only for proven bottlenecks.

---

## Technical debt / future upgrades

- Role-based creator ownership in Supabase (`creator_user_id` instead of device-only ownership).
- Native AR module for specific educational quests (if web overlay limits outcomes).
- Background sync queue for offline evidence uploads.
- Secure keychain storage enhancements for auth/session data.

