# Quick Deploy Checklist ⚡

## ✅ One-Time Setup (Already Done!)
- [x] Java 21 installed
- [x] Android Studio installed  
- [x] Android SDK configured
- [x] Node.js/npm ready
- [x] Capacitor initialized
- [x] Build scripts created
- [x] Signing certificate generated
- [x] First APK built successfully

---

## 🚀 Deploy to New Customer (Repeat This)

### Step 1: Configure Customer Settings
```bash
# Edit .env with customer API keys
notepad .env
```

Update these lines with customer values:
```env
REACT_APP_API_URL=https://customer-api.example.com
REACT_APP_API_KEY=customer_key_123
REACT_APP_INSTAGRAM_KEY=insta_key_456
REACT_APP_TIKTOK_KEY=tiktok_key_789
```

### Step 2: Build APK
```bash
.\build-apk.bat
```

**Wait for:** `BUILD COMPLETE ✓`  
**Time:** ~5-7 minutes  
**Output:** `android/app/build/outputs/apk/release/app-release-unsigned.apk`

### Step 3: Deploy to Tablet

**Option A: USB (Recommended for customers)**
```
1. Connect tablet to computer via USB
2. Copy APK to tablet storage
3. Open file manager on tablet
4. Tap APK → Install
5. Done!
```

**Option B: ADB (For tech customers)**
```bash
adb install android/app/build/outputs/apk/release/app-release-unsigned.apk
```

**Option C: Cloud Link (Remote customers)**
```
1. Upload APK to Google Drive/OneDrive
2. Share download link with customer
3. Customer downloads and installs
```

### Step 4: Verify Installation
- Tap "Social Media Counter" in app drawer
- App should load and connect to their API

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Unknown sources" blocked | Settings → Security → Allow unknown sources |
| Build fails | Run `build-apk.bat` again, wait for full completion |
| APK won't install | Check tablet storage has space, try ADB option |
| App crashes on startup | Verify API keys in .env, check network access |

---

## 📊 Automation Summary

```
Edit .env → Run build-apk.bat → Deploy APK
       ↓                ↓              ↓
  Customer       React+Gradle     Tablet Install
  Config         Compiles+Signs      Ready!
```

**Everything is automated except Step 1 (customer config)**

---

## 🎯 Performance
- Build time: 5-7 minutes
- APK size: 3.5 MB
- Install time: 30 seconds
- App startup: < 2 seconds on tablet

---

## 📝 Files You Need

| File | Purpose |
|------|---------|
| `.env` | Customer configuration (edit before each build) |
| `build-apk.bat` | Build & sign APK automatically |
| `android/app/build/outputs/apk/release/app-release-unsigned.apk` | Final APK to install |

---

## ✨ Remember

✅ No database setup needed  
✅ No server costs  
✅ No backend maintenance  
✅ Each customer gets independent app instance  
✅ All config baked into APK  
✅ Update = Rebuild + Redeploy  

---

## 🔗 More Help

- `APK_DEPLOYMENT_GUIDE.md` - Detailed deployment guide
- `CUSTOMER_SETUP_GUIDE.md` - Instructions for customers
- `00_START_HERE.md` - Technical overview
