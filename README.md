# Viral Counters

Instagram follower counter and Google Reviews display, packaged as a standalone Android APK (Capacitor). The APK has no backend or database: it calls the Instagram Graph API and Google Places API (New) directly, using values baked in from `.env` at build time.

## Building a customer APK

One-time setup on the build PC: Node.js, JDK 21 (`C:\Program Files\Java\jdk-21.0.12.1`) and Android Studio (provides the Android SDK). Run `npm install` once.

1. Edit `.env` - only these need changing per customer:
   - `META_ACCESS_TOKEN` - Instagram token
   - `GOOGLE_PLACES_API_KEY` - key with **Places API (New)** enabled
   - `GOOGLE_PLACE_ID` - the business Place ID
   - `REACT_APP_GOOGLE_REVIEW_URL` - Google review link shown in the QR code

   The `REACT_APP_*` token/key/place values already reference the three above.
2. Double-click `build-apk.bat` (or run it from a terminal).
3. Take `ViralCounters.apk` from the project root and install it on the tablet:
   `adb install -r ViralCounters.apk` (or copy the file to the tablet and open it).

Values are compiled into the APK, so any `.env` change needs a rebuild.

## App name, icon, id

- Name: `android/app/src/main/res/values/strings.xml` (`app_name`, `title_activity_main`) and `appName` in `capacitor.config.ts`.
- Icon/splash source: `branding/viral-counters-logo.png` (generated into `android/app/src/main/res/mipmap-*` and `drawable*/splash.png`).
- APK file name: `android/app/build.gradle` (`outputFileName`).
- Package id `com.socialmediacounter.app` is unchanged so installs update in place.

## Development

```bash
npm start        # React dev server
npm run server   # Node backend (serves /api/* for browser use)
npm test
```

In a browser the app talks to the Node backend; in the Android app it calls the APIs directly (`src/liveData.js`).
