# Social Media Counter - Capacitor Android App

Real-time social media counter display application for Android tablets. Displays live updates from Meta/Instagram, Google Reviews, and other platforms.

---

## **Quick Start**

### **For Customers:**
See [CUSTOMER_SETUP_GUIDE.md](CUSTOMER_SETUP_GUIDE.md)

### **For Developers:**
See [CAPACITOR_DEPLOYMENT.md](CAPACITOR_DEPLOYMENT.md)

---

## **Project Structure**

```
SocialMediaCounter/
├── src/                    (React components)
├── server/                 (Node.js backend)
├── android/                (Capacitor Android project)
├── public/                 (Static assets)
├── build/                  (Production build)
├── capacitor.config.ts     (Capacitor configuration)
├── .env                    (Environment variables)
└── package.json
```

---

## **Available Scripts**

### **Development**

```bash
npm start        # Start React dev server (http://localhost:3000)
npm run server   # Start Node.js backend (http://localhost:4000)
npm run build    # Build React app for production
```

### **Building for Android**

```bash
npm run build              # Build React app
npx cap sync android       # Sync with Capacitor
npx cap open android       # Open in Android Studio
# Then build APK in Android Studio
```

### **Testing**

```bash
npm test         # Run unit tests
```

---

## **Environment Configuration**

The app uses environment variables from `.env` file:

```env
META_ACCESS_TOKEN=your-token-here
GOOGLE_PLACES_API_KEY=your-key-here
PORT=4000
# ... other settings
```

See `.env.example` for all available variables.

---

## **Deployment**

### **Android Tablet**

1. Build the app:
   ```bash
   npm run build
   npx cap sync android
   ```

2. Generate APK in Android Studio:
   - Click **Build → Generate Signed APK**
   - Follow prompts to create signing key

3. Install on tablet:
   ```bash
   adb install app-release.apk
   ```

For detailed instructions, see [CAPACITOR_DEPLOYMENT.md](CAPACITOR_DEPLOYMENT.md)

---

## **Features**

✅ Real-time social media counter display  
✅ Multiple platform integration (Meta, Google Reviews, etc.)  
✅ Responsive design for tablets  
✅ Offline capable  
✅ Auto-start on device boot  
✅ Easy configuration management  
✅ Background service support  

---

## **Technologies**

- **Frontend:** React 19, JavaScript/TypeScript
- **Backend:** Node.js, Express
- **Mobile:** Capacitor, Android
- **APIs:** Meta Graph API, Google Places API

---

## **Documentation**

- [CAPACITOR_DEPLOYMENT.md](CAPACITOR_DEPLOYMENT.md) - Developer deployment guide
- [CUSTOMER_SETUP_GUIDE.md](CUSTOMER_SETUP_GUIDE.md) - Customer installation guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [.env.example](.env.example) - Environment variables template

---

## **Support**

For issues or questions:
1. Check documentation files
2. Review error logs: `adb logcat`
3. Verify `.env` configuration
4. Ensure all API keys are valid

---

**Last Updated:** 2024  
**Version:** 0.1.0