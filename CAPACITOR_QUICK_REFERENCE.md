# Capacitor Quick Reference Card

## **What You Need to Know**

Your app is now a **standalone Android app (APK)** that:
- ✅ Runs on tablets without Termux
- ✅ Auto-starts on device boot
- ✅ Looks professional (not a browser)
- ✅ Easy to distribute and update
- ✅ Works offline if needed

---

## **Install on Your PC (One-Time)**

```bash
# Download: Android Studio
https://developer.android.com/studio

# That's it! (Includes JDK + Android SDK)
```

---

## **Build Process**

```bash
# One command to build and open Android Studio
npm run deploy:android

# In Android Studio:
# Build → Generate Signed APK → Follow wizard
```

**APK Location:** `android/app/build/outputs/apk/release/app-release.apk`

---

## **Install on Tablet**

```bash
# Connect tablet via USB
adb devices

# Install
adb install app-release.apk

# Done! App appears on home screen
```

---

## **Update for New Customer**

```bash
# 1. Edit configuration
nano .env
# Change: META_ACCESS_TOKEN, GOOGLE_PLACES_API_KEY, etc.

# 2. Rebuild
npm run deploy:android
# Generate APK in Android Studio

# 3. Install
adb install app-release.apk
```

---

## **Daily Commands**

```bash
npm start              # Dev server (http://localhost:3000)
npm run server         # Backend (http://localhost:4000)
npm run build          # Build React app
npm run build:android  # Build + sync Android
npm run open:android   # Open Android Studio
npm run deploy:android # Full build pipeline
```

---

## **Documentation**

| Need | File |
|------|------|
| Full guide | [CAPACITOR_DEPLOYMENT.md](CAPACITOR_DEPLOYMENT.md) |
| Customer setup | [CUSTOMER_SETUP_GUIDE.md](CUSTOMER_SETUP_GUIDE.md) |
| Quick help | [DEVELOPER_QUICK_START.md](DEVELOPER_QUICK_START.md) |
| What changed | [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) |
| Setup checklist | [CAPACITOR_SETUP_CHECKLIST.md](CAPACITOR_SETUP_CHECKLIST.md) |

---

## **Troubleshooting**

| Problem | Solution |
|---------|----------|
| adb not found | Reinstall Android Studio |
| Device offline | `adb kill-server && adb start-server` |
| Won't install | `adb uninstall com.socialmediacounter.app` |
| Gradle error | Check Android Studio SDK path |
| App crashes | Check .env values, view `adb logcat` |

---

## **File Locations**

```
Your Computer:
C:\Projects\SocialMediaCounter\
  ├── android/              (Android project)
  ├── build/                (React build output)
  └── capacitor.config.ts

Android Device:
/data/data/com.socialmediacounter.app/

APK Output:
android/app/build/outputs/apk/release/app-release.apk
```

---

## **Key Points**

✅ **No code changes** - React & Node.js untouched  
✅ **Professional app** - Looks like any Android app  
✅ **Easy distribution** - Just send APK file  
✅ **Auto-start** - Runs on device boot automatically  
✅ **Offline capable** - Works without internet  
✅ **Multi-customer** - Different APK per customer  

---

## **Deployment Checklist**

For each customer:
- [ ] Update `.env` with their API keys
- [ ] Run `npm run deploy:android`
- [ ] Generate APK in Android Studio
- [ ] Test on tablet: `adb install app-release.apk`
- [ ] Verify features work
- [ ] Send tablet to customer (or email APK)

---

## **Remember**

- Keep same signing key for all APKs
- Save `.env` versions per customer
- Backup signing key file
- Test on real device before customer delivery

---

**Status:** ✅ Ready to deploy  
**Code Changes:** ✅ None (only build process)  
**Environment:** ✅ No Termux needed
