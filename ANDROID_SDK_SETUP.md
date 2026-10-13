# Android SDK Installation Guide

Your build script requires **Android SDK** to compile APKs.

---

## **Quick Installation**

### **Option A: Download Android Studio (Recommended)**

1. Download: https://developer.android.com/studio
2. Run installer
3. Follow setup wizard
4. Accept all defaults
5. Wait for SDK installation (~5-10 minutes)

**That's it!** SDK installs at: `C:\Users\YourUsername\AppData\Local\Android\Sdk`

### **Option B: Command Line**

```bash
# If you have Android SDK Tools installed
sdkmanager "platforms;android-35"
```

---

## **Verify Installation**

Check if Android SDK exists at:
```
C:\Users\YourUsername\AppData\Local\Android\Sdk
```

If it's there, you're done!

---

## **Build Script Auto-Setup**

The `build-apk.bat` script automatically:
- Detects Android SDK location
- Creates `local.properties` with SDK path
- Passes it to Gradle

**No manual configuration needed!**

---

## **Then Build APK**

Once Android Studio is installed, just run:

```bash
build-apk.bat
```

The script will:
1. ✅ Find Android SDK
2. ✅ Configure Gradle
3. ✅ Build React app
4. ✅ Build APK
5. ✅ Verify APK

Takes ~2-3 minutes!

---

## **Troubleshooting**

### **"Android SDK not found"**

Verify Android Studio is installed:
- Look for folder: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
- If missing: Download Android Studio from https://developer.android.com/studio

### **Build still fails after installing**

Sometimes Gradle cache needs clearing:
```bash
cd android
./gradlew clean
cd ..
build-apk.bat
```

### **"SDK location not found" during build**

The script creates `android/local.properties` automatically.
If it fails:
1. Delete: `android/local.properties`
2. Run: `build-apk.bat` again

---

## **Environment Variable (Manual)**

If you want to set `ANDROID_HOME` manually:

1. Right-click "This PC" → Properties
2. Advanced → Environment Variables
3. New variable:
   - Name: `ANDROID_HOME`
   - Value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
4. Restart PowerShell/terminal

---

## **What Happens Next**

Once Android SDK is installed:

```bash
build-apk.bat
```

Output:
```
[✓] Found Java 21
[✓] Found Android SDK
[1/4] Building React app...
[2/4] Syncing with Android...
[3/4] Building APK...
[4/4] Verifying APK...
✓ APK created successfully!
Location: android/app/build/outputs/apk/release/app-release.apk
```

---

## **Need Help?**

**Error:** SDK location not found
**Fix:** Run `build-apk.bat` again - it auto-detects

**Error:** Gradle build failed
**Fix:** Clear cache → `cd android && ./gradlew clean && cd ..`

**Error:** Android Studio won't install
**Fix:** Check system requirements at https://developer.android.com/studio

---

**Next Step:** Install Android Studio, then run `build-apk.bat`! 🚀
