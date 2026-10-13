# Automated APK Build Guide

Your project now includes **fully automated APK building** with Java 21 support!

---

## **Quick Start**

### **First Time Only: Install Java 21**

```bash
# Option A: Automatic (recommended)
winget install OracleJDK.JDK.21

# Option B: Manual download
https://www.oracle.com/java/technologies/downloads/#java21
```

**Verify installation:**
```bash
verify-java.bat
```

### **Build APK (Every Time)**

**Option A: Batch Script (Simplest)**
```bash
build-apk.bat
```

**Option B: PowerShell (Better output)**
```powershell
.\build-apk.ps1
```

**Option C: NPM Command**
```bash
npm run build:apk
```

---

## **What the Scripts Do**

Both scripts automatically:

1. ✅ Detect Java 21 installation
2. ✅ Verify correct Java version
3. ✅ Build React app
4. ✅ Sync with Capacitor Android
5. ✅ Build APK with Gradle
6. ✅ Verify APK was created
7. ✅ Show APK size and location

**Total time: ~2-3 minutes**

---

## **Build Scripts Overview**

| Script | Type | Command | Best For |
|--------|------|---------|----------|
| `build-apk.bat` | Batch | `build-apk.bat` | Windows Command Prompt |
| `build-apk.ps1` | PowerShell | `.\build-apk.ps1` | PowerShell users |
| `verify-java.bat` | Batch | `verify-java.bat` | Check Java 21 |
| `npm run build:apk` | npm | `npm run build:apk` | Cross-platform |

---

## **Detailed Workflow**

### **Complete Process (Automated)**

```bash
# 1. Edit configuration for customer
nano .env
# Update: META_ACCESS_TOKEN, GOOGLE_PLACES_API_KEY, etc.

# 2. Run build (that's it!)
build-apk.bat

# 3. Wait 2-3 minutes...

# 4. APK is ready at:
# android/app/build/outputs/apk/release/app-release.apk

# 5. Install on tablet
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## **Error Handling**

Both scripts include:
- ✅ Java 21 detection
- ✅ Version verification
- ✅ Build error checking
- ✅ APK verification
- ✅ Helpful error messages

If something fails:
1. Read the error message
2. Fix the issue
3. Run script again
4. It will continue from where it failed

---

## **Customization**

### **Change Java 21 Path**

Edit `build-apk.bat` line 7-8:
```batch
set JAVA_21_PATH=C:\Your\Custom\Path
set JAVA_21_ALT=C:\Alternative\Path
```

### **Add Custom Configuration**

Edit script to add custom steps before/after building:
```batch
REM Custom step before build
echo Doing something custom...

call npm run build
REM ... rest of build
```

---

## **Integration with CI/CD**

### **GitHub Actions Example**

```yaml
name: Build APK
on: [push]
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v2
        with:
          java-version: '21'
      - run: npm install
      - run: npm run build:apk
      - uses: actions/upload-artifact@v2
        with:
          name: apk
          path: android/app/build/outputs/apk/release/app-release.apk
```

---

## **Troubleshooting**

### **"Java 21 not found"**

```bash
# Verify Java is installed
verify-java.bat

# If missing, install:
winget install OracleJDK.JDK.21
```

### **"Gradle build failed"**

```bash
# Clear Gradle cache
cd android
./gradlew clean
cd ..

# Try again
build-apk.bat
```

### **"npm command not found"**

```bash
# Make sure Node.js is installed
node --version

# If missing: https://nodejs.org
```

### **"Port 3000 already in use"**

```bash
# This is fine during APK build
# React dev server isn't started
# This only happens if running npm start separately
```

---

## **Advanced: Debug APK**

Build debug APK for testing:

```bash
# Add to package.json:
"build:apk:debug": "npm run build && npx cap sync android && cd android && gradlew assembleDebug && cd .."

# Use it:
npm run build:apk:debug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## **Performance Tips**

### **Faster Builds**

Skip React build if no frontend changes:
```bash
# Sync only (skip npm build)
npx cap sync android

# Then manually build in Android:
cd android
./gradlew assembleRelease
cd ..
```

### **Cache Gradle**

```bash
# First build: ~3 minutes
# Subsequent builds: ~1-2 minutes (cached)
```

---

## **Installation Workflow**

### **First Customer**

```bash
# 1. Setup once
winget install OracleJDK.JDK.21

# 2. For each customer:
nano .env
build-apk.bat
adb install android/app/build/outputs/apk/release/app-release.apk
```

### **Multiple Customers**

```bash
# Setup once (as above)

# For each customer:
# 1. Edit .env with customer settings
# 2. Run: build-apk.bat
# 3. Copy APK: android/app/build/outputs/apk/release/app-release.apk
# 4. Keep .env file for records (label with customer name)
# 5. Keep APK for customer (label with version/date)
```

---

## **Next Steps**

1. **Install Java 21** (if not already done)
   ```bash
   winget install OracleJDK.JDK.21
   ```

2. **Verify installation**
   ```bash
   verify-java.bat
   ```

3. **Build your first APK**
   ```bash
   build-apk.bat
   ```

4. **Install on tablet**
   ```bash
   adb install android/app/build/outputs/apk/release/app-release.apk
   ```

---

## **Scripts Provided**

- `build-apk.bat` - Main build script (batch)
- `build-apk.ps1` - PowerShell version
- `verify-java.bat` - Check Java 21 installation
- `JAVA21_SETUP.md` - Java 21 installation guide

---

**Automation Complete! 🚀**

Run `build-apk.bat` whenever you need to build APK. It handles everything automatically!
