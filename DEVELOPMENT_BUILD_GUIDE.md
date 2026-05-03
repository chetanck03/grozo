#  Development Build Guide for Grozo

## Problem Solved
The error `RNGoogleMobileAdsModule could not be found` occurs because **Expo Go doesn't support native modules** like AdMob.

## Solution: Create a Development Build

A development build is a custom version of Expo Go that includes all your native modules (AdMob, etc.).

---

## 📱 Quick Setup (Choose ONE method):

### **Method 1: Local Build (Recommended for Testing)**

Build the development client on your computer:

#### For iOS Simulator:
```bash
npx eas build --profile development-simulator --platform ios
```

#### For iOS Device (iPhone):
```bash
npx eas build --profile development --platform ios
```

#### For Android:
```bash
npx eas build --profile development --platform android
```

**What happens:**
- EAS will build a custom development client (~10-15 minutes)
- You'll get a download link (iOS: TestFlight, Android: APK)
- Install it on your device
- Run `npm start` and scan the QR code

---

### **Method 2: Local Development Build (Faster)**

Build directly on your Mac:

```bash
# For iOS Simulator
npx expo run:ios --configuration Development

# For Android Emulator
npx expo run:android --variant debug
```

**What happens:**
- Builds the app locally (~5-10 minutes)
- Automatically launches simulator/emulator
- AdMob will work immediately!

---

##  Step-by-Step Instructions

### **Step 1: Login to EAS**
```bash
npx eas login
```
(You're already logged in as `dev-ck`)

### **Step 2: Configure Project**
The `eas.json` file is already created with build profiles.

### **Step 3: Build Development Client**

**Option A - Cloud Build (Easiest):**
```bash
npx eas build --profile development --platform ios
```

**Option B - Local Build (Faster):**
```bash
npx expo run:ios --configuration Development
```

### **Step 4: Install on Device**

**For Cloud Build:**
- Wait for build to complete (~10 min)
- Download from EAS dashboard or TestFlight
- Install on your iPhone

**For Local Build:**
- Simulator will launch automatically
- Or install on physical device via Xcode

### **Step 5: Run Your App**
```bash
npm start
```
- Scan QR code with the development build app (NOT Expo Go)
- AdMob will work! ✅

---

## 🎯 Key Differences

| Feature | Expo Go | Development Build |
|---------|---------|-------------------|
| AdMob Support | ❌ No | ✅ Yes |
| Native Modules | ❌ No | ✅ Yes |
| Custom Native Code | ❌ No | ✅ Yes |
| Build Time | Instant | 5-15 min |
| Best For | Quick testing | Full features |

---

## 🔧 Configuration Files Created

1. **`eas.json`** - Build profiles for development/preview/production
2. **`app.json`** - AdMob configuration for iOS & Android
3. **`expo-dev-client`** - Package installed for development builds

---

##  Recommended Workflow

### **For Development:**
```bash
# Build once
npx expo run:ios --configuration Development

# Then just run normally
npm start
```

### **For Testing on Real Device:**
```bash
# Build cloud development client
npx eas build --profile development --platform ios

# Install on device from TestFlight
# Then run:
npm start
```

### **For Production:**
```bash
npx eas build --profile production --platform ios
npx eas submit --platform ios
```

---

## 🐛 Troubleshooting

### **Error: "RNGoogleMobileAdsModule could not be found"**
- ❌ You're using Expo Go
- ✅ Switch to development build

### **Build is too slow**
- Use local build: `npx expo run:ios --configuration Development`

### **QR code not working**
- Make sure you're using the development build app, NOT Expo Go
- Both apps can be installed on the same device

---

## 📦 What's Included in Development Build

✅ AdMob (Banner & Interstitial ads)
✅ AsyncStorage (Data persistence)
✅ NetInfo (Internet connectivity check)
✅ All custom native modules
✅ Hot reload for fast development

---

##  Next Steps

1. Choose Method 1 or Method 2 above
2. Build the development client
3. Install on your device/simulator
4. Run `npm start`
5. Scan QR code with development build (not Expo Go)
6. Enjoy full AdMob functionality! 

---

## 📚 Resources

- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Google Mobile Ads](https://docs.expo.dev/versions/latest/sdk/admob/)
