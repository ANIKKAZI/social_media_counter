# Android 15 APK Installation Troubleshooting

## 📱 Your Setup
- **Tablet OS:** Android 15 (latest & compatible ✅)
- **App Requirement:** Android 7.0+ (API 24)
- **APK File:** app-release-unsigned.apk (3.51 MB)

---

## ❌ STEP 1: Enable Unknown Sources

Android 15 requires you to allow installations from unknown sources.

1. On your tablet, go to: **Settings**
2. Scroll down → **Apps & Notifications** (or **Security**)
3. Look for: **"Unknown Sources"** or **"Install Unknown Apps"**
4. Find your **file manager app** (e.g., "Files", "File Manager", "My Files")
5. Toggle: **"Allow from this source"** → **ON**

**Alternative for some tablets:**
- Settings → Security → Developer Options → "Install from USB" → Toggle

---

## ❌ STEP 2: Disable Google Play Protect (Temporarily)

Google Play Protect sometimes blocks unsigned APKs.

1. Open **Google Play Store** app
2. Tap **menu icon** (≡) → **Settings**
3. Find: **"Play Protect"**
4. Toggle: **OFF** (temporarily)
5. Try installing APK again
6. Toggle back: **ON** after successful installation

---

## ❌ STEP 3: Check Storage Space

Ensure your tablet has enough free space.

**Space needed:**
- APK download: 3.51 MB
- Installation: ~10-15 MB  
- **Total required:** At least 50 MB free

**Check on tablet:**
- Settings → **Storage** → Check available space
- Should show **> 100 MB free**

**If full:**
- Delete unused apps or old photos
- Clear app cache
- Then try installation again

---

## ❌ STEP 4: Uninstall Old Version

If you tried installing before and it failed:

1. Long press **"Social Media Counter"** app icon
2. Tap: **"Uninstall"**
3. Confirm: **"Uninstall"**
4. Wait for removal to complete
5. Try new APK installation

---

## ❌ STEP 5: Manual Installation via File Manager

1. Transfer APK to tablet USB storage:
   - Connect tablet via USB
   - Copy `app-release-unsigned.apk` to tablet storage
   - Disconnect USB

2. On tablet: Open **"Files"** or **"File Manager"**

3. Navigate to where you saved the APK

4. Long press: **app-release-unsigned.apk**

5. Select: **"Install"** or **"Open with"** → **"Package Installer"**

6. If prompted: **"Install anyway"** or **"Continue"**

7. Wait for installation bar to complete

8. Once done: App appears in app drawer as **"Social Media Counter"**

---

## ✨ STEP 6: Try Different Transfer Method

If USB transfer keeps failing, try one of these:

### Option A: Email Transfer
1. Email APK from your computer to yourself
2. Open email on tablet
3. Download the APK attachment
4. Tap downloaded APK
5. Tap **"Install"**

### Option B: Cloud Storage (Google Drive / OneDrive)
1. On computer: Upload APK to Google Drive
2. On tablet: Open Google Drive
3. Tap APK file → **"Download"**
4. Open notification → Tap APK
5. Tap **"Install"**

### Option C: Bluetooth Transfer
1. Pair tablet to computer via Bluetooth
2. Send APK file via Bluetooth
3. Accept transfer on tablet
4. Tap downloaded APK → **"Install"**

---

## 🔧 If Still Not Working

Try a **full tablet restart**:

1. Power off tablet completely
2. Wait 10 seconds
3. Power on
4. Try installation again

---

## 📋 Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Parse error" | APK corrupted during transfer | Re-transfer the APK |
| "Installation blocked" | Security settings blocking | Check Steps 1 & 2 |
| "Insufficient storage" | No space left | Delete files, then retry |
| "App not installed" | Generic error, multiple causes | Try Steps 1-5 above |
| "Package appears to be invalid" | APK corrupted | Rebuild: `build-apk.bat` |

---

## 🆘 If Installation Still Fails

1. **Rebuild APK:**
   ```bash
   .\build-apk.bat
   ```

2. **Verify APK integrity:**
   - File size should be ~3.5 MB
   - Check file is not corrupted

3. **Check .env configuration:**
   - Verify API keys are set in `.env`
   - Rebuild after any changes

4. **Try different Android device:**
   - If possible, test on another tablet/phone
   - If it works elsewhere, issue is tablet-specific

---

## ✅ Success Indicators

After successful installation, you should see:

1. ✅ "App installed" confirmation message
2. ✅ **"Social Media Counter"** appears in app drawer
3. ✅ You can tap and launch the app
4. ✅ App loads and connects to configured API

---

## 📱 Once Installed

After successful installation:

1. Tap **"Social Media Counter"** in app drawer
2. App loads (should take < 2 seconds)
3. App connects to your configured API
4. App is ready to use!

---

## 🔗 Need Help?

Refer to:
- `APK_DEPLOYMENT_GUIDE.md` - Full deployment guide
- `QUICK_DEPLOY_CHECKLIST.md` - Quick reference
- `build-apk.bat` - To rebuild if needed
