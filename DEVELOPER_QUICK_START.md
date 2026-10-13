# Developer Quick Start - Capacitor

Quick reference for building and deploying the Android app.

---

## **Prerequisites (One-Time)**

```bash
# Install globally
npm install -g @capacitor/cli

# Android Studio
# Download: https://developer.android.com/studio
```

---

## **Development Workflow**

### **Local Testing**

```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm start
```

Access at: http://localhost:3000

---

## **Building APK for Android**

### **Step 1: Create Production Build**

```bash
npm run build
```

Output: `/build` folder with optimized assets

### **Step 2: Sync with Capacitor**

```bash
npx cap sync android
```

This copies your React build to the Android project.

### **Step 3: Open in Android Studio**

```bash
npx cap open android
```

### **Step 4: Generate APK**

**Debug APK (for testing):**
- Menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
- File: `android/app/build/outputs/apk/debug/app-debug.apk`

**Release APK (for customers):**
- Menu: **Build → Generate Signed Bundle / APK**
- Choose APK
- Create signing key (one-time only)
- File: `android/app/build/outputs/apk/release/app-release.apk`

---

## **Installing on Device**

### **Via USB**

```bash
# Connect tablet via USB cable
adb devices  # Verify connection

# Install APK
adb install app-release.apk

# Or debug version
adb install app-debug.apk
```

### **View Logs**

```bash
adb logcat                    # All logs
adb logcat | grep myapp       # Filtered
adb logcat -c                 # Clear
```

---

## **Configuration Changes**

### **Update .env and Rebuild**

```bash
# 1. Edit environment variables
nano .env

# 2. Rebuild and sync
npm run build
npx cap sync android

# 3. Regenerate APK in Android Studio
```

---

## **Common Commands**

```bash
# Full build from scratch
npm run build && npx cap sync android && npx cap open android

# Just sync (if React code unchanged)
npx cap sync android

# Copy new build
npm run build && npx cap copy android

# Copy assets only
npx cap copy

# Check Android device
adb devices

# Open Android Shell
adb shell

# Force stop app
adb shell am force-stop com.socialmediacounter.app

# Uninstall
adb uninstall com.socialmediacounter.app
```

---

## **File Locations**

```
Your Computer:
/SocialMediaCounter/
  ├── src/               (React source)
  ├── build/             (Built React app)
  └── android/           (Android project)

Android Device:
/data/data/com.socialmediacounter.app/
  ├── files/             (App data)
  └── cache/             (Temporary files)

APK Outputs:
android/app/build/outputs/apk/
  ├── debug/             (Testing)
  └── release/           (Distribution)
```

---

## **Troubleshooting**

### **"adb not found"**
```bash
# Add to PATH or use full path
# C:\Users\YourName\AppData\Local\Android\Sdk\platform-tools\adb.exe
```

### **"Gradle build failed"**
- Android Studio → File → Project Structure → Check SDK
- Ensure JDK is properly installed

### **"Device offline"**
```bash
adb kill-server
adb start-server
adb devices
```

### **App won't install**
```bash
# Clear previous install
adb uninstall com.socialmediacounter.app
adb install app-release.apk
```

---

## **Useful Links**

- Capacitor: https://capacitorjs.com
- Android Dev: https://developer.android.com
- Gradle: https://gradle.org
- React: https://react.dev

---

## **Tips**

- Build once with debug APK to test
- Use Android emulator for quick testing
- Keep `.env` values updated before each build
- Sign APKs with same key for updates
- Test on real device before distribution

---

**Happy building! 🚀**
