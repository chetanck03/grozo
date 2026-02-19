# Grozo Setup Guide 🚀

Follow these steps to get your Grozo app up and running!

## 📋 Prerequisites Checklist

- [ ] Node.js (v16+) installed
- [ ] npm or yarn package manager
- [ ] Expo CLI installed globally
- [ ] iOS Simulator or Android Studio (for testing)
- [ ] Gemini API key (for AI features)

## 🔧 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Open `src/config/api.ts`
4. Replace `YOUR_GEMINI_API_KEY` with your actual key:
   ```typescript
   GEMINI_API_KEY: 'your-actual-api-key-here',
   ```

### 3. Start Development Server
```bash
npm start
```

### 4. Test on Device
- **iOS**: Press `i` in terminal or scan QR with Camera app
- **Android**: Press `a` in terminal or scan QR with Expo Go app
- **Web**: Press `w` in terminal

## 🎯 First Run Checklist

After starting the app, verify these features work:

- [ ] Home screen loads with categories
- [ ] Can add new grocery items
- [ ] Categories display correctly
- [ ] Navigation between tabs works
- [ ] AI suggestions appear when typing (requires API key)
- [ ] Meal planner generates plans (requires API key)

## 🔍 Troubleshooting

### Common Issues

**1. "Gemini API Error"**
- Check your API key in `src/config/api.ts`
- Ensure you have billing enabled in Google Cloud Console
- Verify API key has Gemini API access

**2. "Metro bundler issues"**
```bash
npx expo start --clear
```

**3. "Navigation errors"**
```bash
npm install --force
npx expo install --fix
```

**4. "iOS Simulator not opening"**
- Ensure Xcode is installed
- Open Simulator manually first

**5. "Android emulator issues"**
- Start Android Studio
- Create/start an AVD (Android Virtual Device)

## 📱 Testing Features

### Test AI Features (Requires API Key)
1. Go to Home screen
2. Type in search bar → Should show AI suggestions
3. Go to Profile → Meal Planner
4. Enter preferences → Should generate meal plans

### Test Core Features
1. Add items with different categories
2. Mark items as complete
3. Edit existing items
4. Create family lists
5. Check notifications (may need device permissions)

## 🚀 Ready for Production

### Before Building
1. Update app.json with your app details:
   ```json
   {
     "name": "Your App Name",
     "slug": "your-app-slug",
     "bundleIdentifier": "com.yourcompany.grozo"
   }
   ```

2. Add proper app icons to `/assets/`
3. Test on physical devices
4. Set up EAS Build for app store deployment

### Build Commands
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure project
eas build:configure

# Build for stores
eas build --platform all
```

## 🎉 You're All Set!

Your Grozo app should now be running with all features enabled. Enjoy smart grocery shopping! 🛒

Need help? Check the main README.md or create an issue in the repository.