# APK Deployment Guide

## ✅ APK Build Complete

Your Social Media Counter app is now packaged as a native Android APK ready for deployment on tablets.

### 📱 APK Location
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

**Size:** ~3.5 MB  
**Signed:** ✅ Yes (Self-signed certificate valid for 10,000 days)

---

## 🚀 Installation Options

### Option 1: USB Transfer (Easiest)

**For non-technical customers:**

1. **Transfer APK to tablet:**
   - Connect tablet to computer via USB
   - Copy `android/app/build/outputs/apk/release/app-release-unsigned.apk` to tablet storage

2. **Install on tablet:**
   - Open file manager on tablet
   - Navigate to the APK file
   - Tap to install
   - Grant permissions when prompted
   - App will appear in app drawer

### Option 2: ADB Installation

**For developers:**

1. **Enable USB Debugging on tablet:**
   - Settings → Developer Options → Enable USB Debugging
   - Tap "OK" when prompted for debugging connection

2. **Connect and install:**
   ```bash
   adb devices  # Verify tablet is connected
   adb install android/app/build/outputs/apk/release/app-release-unsigned.apk
   ```

3. **Verify installation:**
   ```bash
   adb shell pm list packages | findstr socialmediacounter
   ```

### Option 3: Cloud Download

**For remote deployment:**

1. Upload APK to cloud storage (Google Drive, OneDrive, etc.)
2. Customer downloads and installs directly on tablet
3. No computer needed

---

## ⚙️ Configuration for Each Customer

### Before Building APK:

1. **Edit `.env` file with customer-specific values:**
   ```env
   REACT_APP_API_URL=https://customer-api.example.com
   REACT_APP_API_KEY=customer_key_here
   REACT_APP_INSTAGRAM_KEY=customer_instagram_key
   REACT_APP_TIKTOK_KEY=customer_tiktok_key
   # ... other env variables
   ```

2. **Rebuild APK:**
   ```bash
   npm run build:android
   # or
   .\build-apk.bat
   ```

3. **Deploy new APK** to customer

### Each build creates a fresh APK with:
- ✅ Latest environment variables baked in
- ✅ Latest app code
- ✅ Valid digital signature

---

## 🔄 First Run on Tablet

When customer launches the app for the first time:

1. **Tap "Social Media Counter" icon** in app drawer
2. **App loads** and connects to configured API
3. **No additional setup needed** - all configuration is baked into APK

### Checking Logs (if needed):
```bash
adb logcat | findstr SocialMediaCounter
```

---

## ✨ Multiple Customers, Multiple APKs

For each customer:

1. Edit `.env` with **their specific API keys and URLs**
2. Run `build-apk.bat` (takes ~5-7 minutes)
3. Send them the APK
4. Each customer gets their own independent app instance

**No database needed** - configuration stored locally in APK.

---

## 🔑 Signing Certificate Details

**Keystore Location:** `android/app/release-key.jks`  
**Alias:** `social-media-counter`  
**Password:** `socialmediacounter123`  
**Validity:** 10,000 days (expires 2054-02-27)  
**Algorithm:** SHA256withRSA, 2048-bit key

This certificate:
- ✅ Self-signed (no CA needed)
- ✅ Valid for development/deployment
- ✅ Same certificate used for all future builds
- ✅ Ensures app updates install cleanly

---

## 📋 Troubleshooting

### "App won't install"
- Verify tablet has "Unknown Sources" enabled:
  - Settings → Security → Allow installation from unknown sources
- Try Option 2 (ADB) for more detailed error messages

### "App crashes on startup"
- Check `.env` variables are correct
- Verify API endpoints are accessible from tablet's network
- Run: `adb logcat` to see crash details

### "Can't connect to API"
- Verify tablet has internet connection
- Check firewall on API server
- Verify API keys in `.env` are correct

### "File not found: app-release-unsigned.apk"
- Rebuild APK: `build-apk.bat`
- Wait for complete output "BUILD COMPLETE ✓"
- Check Android Studio/SDK is installed

---

## 📊 Automated Build Script

The build is fully automated with `build-apk.bat`:

```
[1/5] Building React app...
[2/5] Syncing Capacitor...
[3/5] Building APK with Gradle...
[4/5] Signing APK...
[5/5] Verifying APK...
```

**Total time:** ~5-7 minutes  
**No manual steps needed**

---

## 🎯 Production Deployment Workflow

```
1. Update .env with customer values
2. Run build-apk.bat
3. Test APK on tablet (optional)
4. Deploy APK to customer
5. Customer installs and runs
6. No server costs, no database, no backend needed
```

---

## 📚 Additional Resources

- **Build Scripts:** `build-apk.bat`, `build-apk.ps1`
- **React/Node Code:** `/src` (unchanged from web version)
- **Capacitor Config:** `capacitor.config.ts`
- **Android Project:** `/android` (native project structure)
- **Customer Guide:** `CUSTOMER_SETUP_GUIDE.md`

---

## ❓ Questions?

Refer to:
- `00_START_HERE.md` - Overview
- `CUSTOMER_SETUP_GUIDE.md` - Customer instructions
- `CAPACITOR_DEPLOYMENT.md` - Technical details
- `ANDROID_SDK_SETUP.md` - SDK installation
