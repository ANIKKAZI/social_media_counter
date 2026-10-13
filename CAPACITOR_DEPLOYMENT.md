# Capacitor Android Deployment Guide

This application is now packaged as a **Capacitor Android App** - a professional, standalone native Android application.

---

## **Prerequisites (One-Time Setup)**

### **On Your Development PC:**

1. **Java Development Kit (JDK 11+)**
   - Download: https://www.oracle.com/java/technologies/downloads/
   - Or install: `openjdk-11-jdk` from Microsoft Store
   - Verify: `java -version`

2. **Android SDK & Android Studio**
   - Download: https://developer.android.com/studio
   - This includes both JDK and Android SDK
   - Install and accept license agreements

3. **Environment Variables** (if not using Android Studio)
   ```
   JAVA_HOME=C:\Program Files\Java\jdk-11
   ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   ```

---

## **Build Process (For Each Deployment)**

### **Step 1: Build React App**
```bash
npm run build
```
Creates optimized production build in `/build` folder

### **Step 2: Sync with Capacitor**
```bash
npx cap sync android
```
Copies React build to Android native project

### **Step 3: Open in Android Studio**
```bash
npx cap open android
```
Launches Android Studio with the project ready to build

### **Step 4: Generate APK in Android Studio**

**Method A: Debug APK (Testing)**
- Click: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
- File location: `android/app/build/outputs/apk/debug/app-debug.apk`
- Use for: Testing on your device

**Method B: Release APK (Customers)**
- Click: **Build → Generate Signed Bundle / APK**
- Choose: APK
- Create signing key (one-time)
- File location: `android/app/build/outputs/apk/release/app-release.apk`
- Use for: Customer distribution

### **Step 5: Install on Tablet**

**Via USB Cable:**
```bash
# Connect tablet via USB
adb install app-release.apk
```

**Via File Transfer:**
1. Copy APK to tablet
2. Open file manager
3. Tap APK file
4. Install

---

## **Environment Configuration**

### **Option 1: Edit .env Before Build (Recommended)**

```bash
# 1. Edit configuration
nano .env

# 2. Rebuild app
npm run build
npx cap sync android

# 3. Rebuild APK in Android Studio
```

### **Option 2: Access .env on Device (Advanced)**

The app reads `.env` from the device file system:
- Location: `/data/data/com.socialmediacounter.app/files/`
- Use Capacitor Filesystem API to modify

---

## **Auto-Start on Boot**

### **For Each Tablet Deployment:**

The Android app is configured to start automatically on device reboot.

**Configuration File:**
- Location: `android/app/src/main/AndroidManifest.xml`
- Includes: `RECEIVE_BOOT_COMPLETED` permission
- Automatically handles startup

---

## **File Structure**

```
SocialMediaCounter/
├── src/                          (React source - unchanged)
├── server/                       (Node.js backend - unchanged)
├── public/                       (Assets - unchanged)
├── build/                        (Production build)
├── android/                      (NEW - Android native project)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   └── assets/public/    (Built React app)
│   │   └── build.gradle
│   ├── gradle/
│   └── build.gradle
├── capacitor.config.ts           (NEW - Capacitor configuration)
├── package.json
├── .env                          (Environment variables)
└── README.md
```

---

## **Workflow**

### **During Development:**
```bash
# 1. Make changes to React/Node.js code
# 2. Test locally: npm start & npm run server
# 3. Build and sync:
npm run build
npx cap sync android

# 4. Open in Android Studio and run
npx cap open android
```

### **For Customer Deployment:**
```bash
# 1. Configure .env for customer
# 2. Build release APK
npm run build
npx cap sync android
# In Android Studio: Build → Generate Signed APK

# 3. Install on tablet
adb install app-release.apk

# 4. Done! App auto-starts on boot
```

---

## **Updating Configuration on Installed App**

### **Method 1: Rebuild & Reinstall (Recommended)**
```bash
# 1. Update .env
# 2. Rebuild and deploy new APK
npm run build
npx cap sync android
# Generate new APK in Android Studio
adb install app-release.apk
```

### **Method 2: Direct File Modification (Advanced)**
```bash
# Access device file system
adb shell

# Navigate to app data
cd /data/data/com.socialmediacounter.app/files/

# Edit config files
cat config.json
```

---

## **Troubleshooting**

### **Build Issues**
- Ensure JDK and Android SDK are installed
- Check: `java -version` and `adb version`
- In Android Studio: File → Project Structure → Check SDK location

### **APK Won't Install**
- Check: USB debugging enabled on tablet
- Check: Developer Options enabled
- Try: `adb devices` to verify connection

### **App Crashes on Startup**
- Check: `.env` file syntax
- Check: All API keys are valid
- Check: Backend server is running (if needed)
- View logs: `adb logcat`

---

## **Distribution**

### **Single Tablet:**
1. Build APK
2. Connect via USB
3. Install: `adb install app-release.apk`

### **Multiple Tablets:**
1. Build APK with customer-specific .env
2. Email APK to customer
3. Customer installs via file manager
4. App auto-starts after first boot

### **Via Google Play (Optional):**
- Requires Google Play Developer account
- More professional distribution
- Can manage updates centrally

---

## **Key Features**

✅ **Standalone APK** - Installs like any Android app  
✅ **No Terminal Needed** - Professional, user-friendly  
✅ **Auto-Start on Boot** - Works immediately after reboot  
✅ **Background Service** - Continues running in background  
✅ **File System Access** - Can modify configuration on device  
✅ **Offline Capable** - Works without internet (if needed)  
✅ **Easy Updates** - Distribute new APK for configuration changes  

---

## **Next Steps**

1. Install Android Studio on your PC
2. Follow **Build Process** section above
3. Test on tablet
4. Generate release APK
5. Deploy to customers

For questions, refer to:
- Capacitor Docs: https://capacitorjs.com
- Android Dev: https://developer.android.com
