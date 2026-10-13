# ⚡ APK Build - Quick Start (30 seconds)

## **TL;DR - Just Do This**

### **One Time Setup**
```bash
winget install OracleJDK.JDK.21
```

### **Every Time You Need APK**
```bash
build-apk.bat
```

That's it! APK will be ready in ~2-3 minutes.

---

## **What This Does**

```
build-apk.bat automatically:
├─ Detects Java 21
├─ Builds React app
├─ Syncs with Android
├─ Builds APK with Gradle
└─ Verifies APK is ready

Output: android/app/build/outputs/apk/release/app-release.apk
```

---

## **Install on Tablet**

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## **For Each Customer**

```bash
# 1. Edit configuration
nano .env

# 2. Build APK
build-apk.bat

# 3. Done! APK is ready
```

---

## **Troubleshooting**

```bash
# Check Java 21 is installed
verify-java.bat

# If Java 21 missing:
winget install OracleJDK.JDK.21
```

---

**That's all you need to know!** 🚀
