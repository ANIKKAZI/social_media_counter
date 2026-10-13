# Java 21 Installation Guide

Your build script requires **Java 21 LTS** to build APKs.

---

## **Quick Installation**

### **Option A: Automatic (Recommended)**

```bash
# Windows Command Prompt (as Administrator)
winget install OracleJDK.JDK.21
```

**Wait for installation to complete, then verify:**
```bash
java -version
```

Should show: `openjdk version "21.x.x"`

---

### **Option B: Manual Download**

1. Download from: https://www.oracle.com/java/technologies/downloads/#java21
2. Select: **Windows x64 Installer**
3. Run installer
4. Accept defaults
5. Finish

---

## **Verify Installation**

Run this script:
```bash
verify-java.bat
```

Or manually:
```bash
java -version
```

---

## **Build APK**

Once Java 21 is installed, just run:

```bash
build-apk.bat
```

The script will:
- ✅ Detect Java 21 automatically
- ✅ Verify correct version
- ✅ Build React app
- ✅ Sync with Android
- ✅ Generate APK
- ✅ Show result

**Takes ~2-3 minutes total**

---

## **Troubleshooting**

### **"Java 21 not found"**

Make sure it's installed at:
- `C:\Program Files\Java\jdk-21` (standard path)
- `C:\Program Files\Java\jdk-21.0.1` (version-specific)

Or modify the path in `build-apk.bat` line 7-8

### **"Unsupported class file major version"**

This means Java 21 isn't being used. Run:
```bash
verify-java.bat
```

Then try:
```bash
build-apk.bat
```

### **Manual path update (if Java installed elsewhere)**

Edit `build-apk.bat` and change:
```batch
set JAVA_21_PATH=C:\Your\Java\21\Path
```

---

## **What Java 21 Is**

Java 21 LTS (Long Term Support) is:
- ✅ Free to download and use
- ✅ Latest stable Java version
- ✅ Required by modern Gradle
- ✅ Safe and widely used

---

## **Installation Complete?**

```bash
build-apk.bat
```

Your APK will be ready in ~3 minutes! 🚀
