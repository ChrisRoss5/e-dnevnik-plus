# Google Analytics Events Documentation

## Overview

e-Dnevnik Plus is a Chrome extension (Manifest V3) with two modes of operation:

- **App** — a standalone Vue app (`/dist/app`) that replaces the original e-Dnevnik with a full redesign
- **Classic** — a content script (`/dist/content-script.js`) injected into `ocjene.skole.hr` that enhances the original site

Both modes, plus the extension's **service worker** and **popup**, share a single analytics pipeline that sends events to Google Analytics 4 via the Measurement Protocol.

## Architecture

```
┌──────────────────────────────────────────────────────┐
│  Senders                                             │
│                                                      │
│  Vue App (app)          Content Script (classic)     │
│  Popup (popup)          Service Worker (direct)      │
│                                                      │
│  chrome.runtime.sendMessage({                        │
│    name: "SEND_ANALYTICS_EVENT",                     │
│    params: { name, ...eventSpecificParams }          │
│  })                                                  │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│  Service Worker — onMessage handler                  │
│  extension_scripts/service-worker/service-worker.ts  │
│                                                      │
│  sendAnalyticsEvent(params, sender)                  │
│    1. Detects sender context from sender.url         │
│    2. Reads userId from chrome.storage.sync          │
│    3. Sanitizes event name (replaces - with _)       │
│    4. Calls analytics.fireEvent(userId, name, params)│
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│  Analytics class — fireEvent()                       │
│  extension_scripts/service-worker/components/        │
│    google-analytics.ts                               │
│                                                      │
│  POST to GA4 Measurement Protocol:                   │
│    https://www.google-analytics.com/mp/collect       │
│    ?measurement_id=G-YM0ZN005N7                      │
│    &api_secret=...                                   │
│                                                      │
│  Body: { client_id, user_id, user_data: {},          │
│          events: [{ name, params }] }                │
└──────────────────────────────────────────────────────┘
```

### Sender detection

The service worker determines the `sender` param based on where the message originated:

| `sender` value   | Condition                                                                  |
|-------------------|----------------------------------------------------------------------------|
| `service_worker`  | Event fired directly inside the service worker (install/update lifecycle)  |
| `popup`           | `sender.url` ends with `popup.html`                                       |
| `classic`         | `sender.url` starts with `http` — the content script running on `ocjene.skole.hr` |
| `app`             | Anything else — the Vue app running inside the extension's own page       |

### Identity & session params

These are automatically attached to **every** event by the analytics pipeline:

| Param | Description | Storage | Lifecycle |
|-------|-------------|---------|-----------|
| `sender` | Which part of the extension sent the event (see table above) | Computed per event | — |
| `client_id` | Random UUID (`crypto.randomUUID()`) identifying the browser installation. Persists across sessions and user accounts. | `chrome.storage.local` | Created once on first event, persists until extension is uninstalled |
| `user_id` | SHA-256 hash of the student's e-Dnevnik username (without `@` domain). Allows tracking across devices for the same student. Set to `null` if the user hasn't logged in yet. | `chrome.storage.sync` (key: `userId`) | Created at login (both App and Classic), synced across Chrome profiles via `storage.sync` |
| `session_id` | Timestamp-based session identifier. A new session starts after 30 minutes of inactivity. | `chrome.storage.session` (in-memory only) | Expires after 30 min of inactivity, lost on browser restart |
| `engagement_time_msec` | Hardcoded to `100`. Required by GA4 Measurement Protocol for events to appear in reports. | — | — |

> **Privacy note:** `user_id` is a one-way SHA-256 hash of the username portion only (e.g. `student123` from `student123@skole.hr`). The raw username is never sent to GA4.

---

## Events Table

| # | Event Name | Sender | id | Trigger | Params | File |
|---|------------|--------|----|---------|--------|------|
| 1 | `extension_install` | `service_worker` | — | Extension installed for the first time | `version` — installed version from manifest | `service-worker.ts:12` |
| 2 | `extension_update` | `service_worker` | — | Extension updated to a different version | `previous_version`, `new_version` | `service-worker.ts:42` |
| 3 | `page_view` | `app` | — | Vue router `beforeEach` guard fires on navigation (skips internal `/-/` routes). Only sent if `analyticsInfo` is populated (i.e. user data loaded). | `page_url` — matched route path or `"--"`, `school_name`, `class_year_full` (e.g. `"7.a"`), `class_year` (numeric), `user_type` (`"osnovnoskolac"` / `"srednjoskolac"`) | `src/router/index.ts:121` |
| 4 | `page_view` | `classic` | — | Content script `initAds()` runs on any `ocjene.skole.hr` page load | `page_url` — full `document.location.href`, `school_name` — from `.school-name` DOM element, `class_year_full` — from `.school-data .class > .bold`, `class_year` — parsed int or `-1`, `user_type` | `extension_scripts/content-script/components/ads.ts:16` |
| 5 | `error` | `app` | — | Vue `app.config.errorHandler` catches an unhandled component error | `error` — stack trace or info string, whitespace-collapsed, **truncated to 99 chars** | `src/main.ts:99` |
| 6 | `error` | `app` | — | `window.addEventListener("error")` in the Vue app. `ResizeObserver` errors are ignored. | `error` — `event.error` or `event.message`, whitespace-collapsed, **truncated to 99 chars** | `src/main.ts:115` |
| 7 | `error` | `classic` | — | `window.addEventListener("error")` in the content script | `error` — raw `event.error`, **not truncated** | `extension_scripts/content-script/content-script.ts:10` |
| 8 | `click_button` | `app` | `settings` | Settings action button clicked (e.g. delete user data) | `option` — the action name (e.g. `"deleteUserData"`) | `src/views/settings/Settings.vue:90` |
| 9 | `click_button` | `app` | `settings` | User toggles a per-user setting (Option component) | `[settingName]` — dynamic key matching the setting name, value is the new boolean | `src/views/settings/Option.vue:50` |
| 10 | `click_button` | `app` | `websites` | User adds a custom website shortcut | `website` — the name entered by the user | `src/views/settings/Websites.vue:100` |
| 11 | `click_button` | `app` | `calendar` | User changes a calendar view option | `[optionName]` — dynamic key, value is the new setting value | `src/views/calendar/Calendar.vue:231` |
| 12 | `click_button` | `app` | `calculator` | User changes a calculator option | `[optionName]` — dynamic key, value is the new setting value | `src/views/calculator/Calculator.vue:321` |
| 13 | `click_button` | `app` | `subjects` | User changes a subjects view option (zoom, sort, etc.) | `[optionName]` — dynamic key, value is the new value or `"--"` if undefined | `src/views/class/subjects/Subjects.vue:266` |
| 14 | `view_ad` | `app` | `ad-popup` | Popup ad displayed to the user for the first time (tracked once per ad via `adsShown` array in storage) | `ad_id` | `src/scripts/ads.ts:137` |
| 15 | `view_ad` | `app` | `ad-navbar` | Navbar ad carousel slides to a new ad (tracked once per ad per page load via in-memory `viewedAds`) | `ad_id` | `src/components/NavbarAds.vue:94` |
| 16 | `view_ad` | `classic` | `ogl-navbar` | Classic left-menu ad image loaded and appended to the DOM | `ad_id` | `extension_scripts/content-script/components/ads.ts:143` |
| 17 | `view_ad` | `classic` | `ogl-floater` | Floating ad auto-displayed alongside the navbar ad on page load | `ad_id`, `event` — `"until_closed"` or `"once"` depending on ad config | `extension_scripts/content-script/components/ads.ts:152` |
| 18 | `view_ad` | `classic` | `ogl-floater` | User hovers over the navbar ad for 500ms+, revealing the floater | `ad_id`, `event` — `"hover"` | `extension_scripts/content-script/components/ads.ts:179` |
| 19 | `click_ad` | `app` | `ad-popup` | User clicks the popup ad | `ad_id` | `src/components/PopupAd.vue:36` |
| 20 | `click_ad` | `app` | `ad-navbar` | User clicks a navbar ad banner in the carousel | `ad_id` | `src/components/NavbarAds.vue:74` |
| 21 | `click_ad` | `classic` | `ogl-navbar` | User clicks the left-menu ad on the original e-Dnevnik site | `ad_id` | `extension_scripts/content-script/components/ads.ts:87` |
| 22 | `click_ad` | `classic` | `ogl-floater` | User clicks the floating ad on the original e-Dnevnik site | `ad_id` | `extension_scripts/content-script/components/ads.ts:106` |
