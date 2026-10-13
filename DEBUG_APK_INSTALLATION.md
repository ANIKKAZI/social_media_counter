# Debug APK Installation Guide (Android 15)

## 📱 What's Different?

**Debug APK** is simpler and often more compatible with Android 15:
- ✅ No signing certificate needed
- ✅ Faster to install
- ✅ Better error messages
- ✅ Easier to troubleshoot

**File:** `app-debug.apk` (4.5 MB)

---

## 🚀 Installation Steps

### Step 1: Transfer APK to Tablet

**Option A: USB Transfer (Recommended)**
1. Connect tablet to computer via USB cable
2. On tablet: Allow "File Transfer" when prompted
3. On computer: Copy `app-debug.apk` to tablet storage
   ```
   From: C:\Projects\SocialMediaCounter\android\app\build\outputs\apk\debug\app-debug.apk
   To: Tablet → Internal Storage (or SD Card if available)
   ```
4. Disconnect USB

**Option B: Email Transfer**
1. On computer: Email `app-debug.apk` to yourself
2. On tablet: Open email, download attachment
3. File downloads to tablet's Downloads folder

**Option C: Cloud Storage**
1. On computer: Upload `app-debug.apk` to Google Drive
2. On tablet: Open Google Drive app
3. Find the APK file → Tap download icon
4. File downloads to tablet

---

### Step 2: Enable Installation from Unknown Sources (If Not Done)

On your tablet:
1. Go to **Settings**
2. Tap **Security** or **Privacy & Security**
3. Look for **"Install Unknown Apps"** or **"Unknown Sources"**
4. Find **"File Manager"** or **"Files"** app
5. Toggle **ON** to allow installation

---

### Step 3: Install the APK

**Method A: File Manager (Manual Install)**

1. On tablet: Open **File Manager** or **Files** app
2. Navigate to where you saved the APK:
   - If USB: Look in `Internal Storage` → `DCIM` or root folder
   - If email: Check `Downloads` folder
   - If cloud: Check `Downloads` folder
3. Tap the **app-debug.apk** file
4. A dialog appears: "Install this app?"
5. Tap **"Install"** (ignore any warnings about unsigned app)
6. Installation begins (shows progress bar)
7. Wait for: **"Installation Complete"** or **"App Installed"**
8. Tap **"Open"** to test or **"Done"**

---

### Step 4: Verify Installation

✅ Check if app was installed:
- Look in app drawer for **"Social Media Counter"**
- App icon should appear on home screen option
- Tap app → Should load (takes a few seconds first time)

---

## 🆘 If Still Getting "App not installed"

### Troubleshooting

**Cause 1: Storage Space**
- Check tablet storage: Settings → Storage
- Need at least 50 MB free
- If full: Delete old files, then retry

**Cause 2: File Corrupted During Transfer**
- Delete partially installed file
- Try different transfer method:
  - If USB failed → Try email or cloud
  - If email failed → Try USB or cloud
  - If cloud failed → Try USB or email

**Cause 3: Previous Install Conflict**
- Uninstall old version:
  1. Long press "Social Media Counter" app
  2. Tap "Uninstall"
  3. Confirm "Uninstall"
  4. Wait for removal
  5. Try installing debug APK again

**Cause 4: Android 15 Compatibility Issue**
- Try restarting tablet:
  1. Power off completely
  2. Wait 10 seconds
  3. Power on
  4. Try installation again

---

## 🔍 Getting Better Error Messages (Advanced)

If you have a computer near the tablet, you can get detailed error info:

### Using ADB (if setup)

1. Connect tablet via USB
2. Enable USB Debugging on tablet:
   - Settings → Developer Options → USB Debugging → ON
3. On computer, run:
   ```bash
   C:\Users\anike\AppData\Local\Android\Sdk\platform-tools\adb.exe install "C:\Projects\SocialMediaCounter\android\app\build\outputs\apk\debug\app-debug.apk"
   ```
4. Watch for detailed error messages

Common ADB errors:
- `INSTALL_PARSE_FAILED_NO_CERTIFICATES` → Needs signing (shouldn't happen with debug)
- `INSTALL_FAILED_INVALID_APK` → Corrupted file, re-download
- `INSTALL_FAILED_INSUFFICIENT_STORAGE` → Not enough space
- `INSTALL_FAILED_CONFLICTING_PACKAGE` → Uninstall old version first

---

## ✨ If Debug APK Doesn't Work

Try releasing with lower SDK version:

1. On computer, edit: `android/variables.gradle`
2. Change `targetSdkVersion = 36` to `targetSdkVersion = 34`
3. Save file
4. Rebuild:
   ```bash
   .\build-apk.bat
   ```
5. Try installing the new release APK

---

## 📋 Checklist Before Installing

- [ ] Debug APK file exists: `android\app\build\outputs\apk\debug\app-debug.apk`
- [ ] File size: ~4.5 MB (not 0 bytes)
- [ ] Transferred to tablet successfully
- [ ] Unknown Sources enabled on tablet
- [ ] At least 50 MB free storage on tablet
- [ ] Previous app uninstalled (if was there)
- [ ] Tablet has internet connection (for API calls)

---

## 🎯 After Successful Installation

1. App appears in app drawer as **"Social Media Counter"**
2. Tap to launch
3. First load takes ~2-3 seconds
4. App connects to configured API
5. App is ready to use!

---

## 📱 If App Launches But Won't Connect to API

Check:
- Tablet has WiFi/internet connection
- API keys in `.env` file are correct
- API server is reachable (might have network restrictions)
- Check tablet firewall settings

---

## 🔗 Next Steps

If debug APK works:
- ✅ We know the issue is with release APK signing
- ✅ Will modify build process for Android 15 compatibility
- ✅ Rebuild release APK with new settings

If debug APK STILL doesn't work:
- 🔧 There's an issue with React build or Capacitor configuration
- 🔧 We need to check APK contents and Android Manifest
- 🔧 May need to rebuild React app or check for runtime errors
