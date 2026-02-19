# Grozo - Smart Grocery List Mobile App 🛒

A modern, AI-powered grocery list mobile app built with React Native and Expo. Grozo helps you organize your shopping with smart suggestions, meal planning, and family list sharing.

##  Features

### Core Features
- ✅ Add / Edit / Delete grocery items
- ✅ Quantity selector with multiple units
- ✅ Category-wise organization (8 predefined categories)
- ✅ Auto-suggest items with AI integration (Gemini API)
- ✅ Low stock reminders & notifications
- ✅ AI Meal Planner with auto-generated grocery lists

### Design & UI
- ✅ Modern clean minimal UI with green grocery theme
- ✅ Home screen with grocery categories
- ✅ Add/Edit item screens with quantity selectors
- ✅ Shared family list interface
- ✅ Bottom tab navigation
- ✅ Progress tracking and completion status

### Smart Features
- 🤖 **AI-Powered Suggestions**: Gemini API integration for smart item suggestions
- 📱 **Meal Planning**: AI generates meal plans and shopping lists
- 👨‍👩‍👧‍👦 **Family Lists**: Shared grocery lists for family coordination
- 🔔 **Smart Notifications**: Low stock alerts and shopping reminders
- 💰 **Price Tracking**: Optional price tracking and comparison
- 📊 **Shopping Analytics**: Track spending and completion rates

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grozo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Gemini API**
   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Open `src/services/geminiService.ts`
   - Replace `YOUR_GEMINI_API_KEY` with your actual API key

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   ├── GroceryItem.tsx
│   └── CategoryCard.tsx
├── screens/            # App screens
│   ├── HomeScreen.tsx
│   ├── CategoriesScreen.tsx
│   ├── ListsScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── AddItemScreen.tsx
│   ├── EditItemScreen.tsx
│   ├── MealPlannerScreen.tsx
│   └── FamilyListsScreen.tsx
├── navigation/         # Navigation setup
│   └── AppNavigator.tsx
├── services/          # External services
│   ├── geminiService.ts
│   ├── notificationService.ts
│   └── shoppingService.ts
├── store/             # State management
│   └── groceryStore.ts
└── types/             # TypeScript types
    └── index.ts
```

## 🎨 Design System

### Colors
- **Primary Green**: `#22c55e` - Main brand color
- **Secondary Colors**: Blue (`#3b82f6`), Orange (`#f59e0b`), Red (`#ef4444`)
- **Neutral**: Gray scale from `#f9fafb` to `#374151`

### Typography
- Uses system fonts with Tailwind CSS classes
- Font weights: regular (400), semibold (600), bold (700)

### Components
- Rounded corners (`rounded-xl`, `rounded-2xl`)
- Subtle shadows (`shadow-sm`)
- Consistent spacing using Tailwind classes

## 🤖 AI Integration

### Gemini API Features
1. **Smart Suggestions**: Get relevant grocery items based on search queries
2. **Auto-Categorization**: Automatically categorize items into appropriate categories
3. **Meal Planning**: Generate weekly meal plans with ingredient lists
4. **Shopping Tips**: Get personalized shopping advice and money-saving tips

### Setup Gemini API
```typescript
// In src/services/geminiService.ts
const GEMINI_API_KEY = 'your-actual-api-key-here';
```

## 📊 State Management

Uses Zustand for lightweight state management:

- **Items**: Grocery list items with CRUD operations
- **Categories**: Predefined grocery categories
- **Meal Plans**: AI-generated meal plans
- **Family Lists**: Shared grocery lists
- **Suggestions**: AI-powered item suggestions

## 🔔 Notifications

### Features
- Low stock alerts when items reach threshold
- Daily shopping reminders
- Weekly meal planning reminders
- Family list update notifications

### Setup
Notifications are automatically configured. The app requests permissions on first use.

## 👨‍👩‍👧‍👦 Family Lists

### Features
- Create shared grocery lists
- Real-time synchronization (mock implementation)
- Multiple family members support
- Individual item tracking per list

### Usage
1. Navigate to Profile → Family Lists
2. Create a new family list
3. Add items to the shared list
4. Family members can view and edit the list

## 🛠 Development

### Available Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
```

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Tailwind CSS with NativeWind for styling
- ESLint and Prettier for code formatting

## 📦 Dependencies

### Core
- **React Native**: Mobile app framework
- **Expo**: Development platform and tools
- **React Navigation**: Navigation library
- **Zustand**: State management
- **NativeWind**: Tailwind CSS for React Native

### UI & Icons
- **@expo/vector-icons**: Icon library
- **react-native-safe-area-context**: Safe area handling
- **react-native-gesture-handler**: Gesture handling

### Services
- **expo-notifications**: Push notifications
- **Gemini API**: AI-powered features

## 🚀 Deployment

### Build for Production
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### App Store Submission
1. Configure app.json with proper bundle identifiers
2. Add app icons and splash screens
3. Build production versions with EAS
4. Submit to App Store Connect (iOS) or Google Play Console (Android)

## 🔧 Configuration

### Environment Variables
Create a `.env` file for sensitive configuration:
```
GEMINI_API_KEY=your_gemini_api_key
```

### App Configuration
Update `app.json` for:
- App name and description
- Bundle identifiers
- Permissions
- Icons and splash screens

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **Google AI** for Gemini API integration
- **Tailwind CSS** for the utility-first CSS framework
- **React Navigation** for seamless navigation

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

---

**Grozo** - Making grocery shopping smarter, one list at a time! 🛒✨