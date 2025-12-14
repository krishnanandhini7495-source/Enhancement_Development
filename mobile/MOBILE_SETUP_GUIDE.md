# React Native Mobile App - Setup Guide

## Overview
This guide will help you create a React Native mobile application that connects to your existing .NET Web API backend.

## Prerequisites

### Required Software
1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/

2. **React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

3. **For Android Development:**
   - **Android Studio** (includes Android SDK)
   - **Java Development Kit (JDK 11 or higher)**
   - Configure ANDROID_HOME environment variable

4. **For iOS Development (Mac only):**
   - **Xcode** (latest version)
   - **CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

## Project Initialization

### Step 1: Create React Native Project
```bash
# Navigate to the salon software directory
cd "C:\Users\krishna nandhini\Documents\nandhini\nandhini\salon software"

# Create new React Native project
npx react-native@latest init SalonMobileApp --template react-native-template-typescript

# Navigate into the project
cd SalonMobileApp
```

### Step 2: Install Essential Dependencies
```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs

# Navigation dependencies
npm install react-native-screens react-native-safe-area-context

# State Management
npm install @reduxjs/toolkit react-redux

# API & Network
npm install axios

# Storage (for tokens)
npm install @react-native-async-storage/async-storage

# Form handling
npm install react-hook-form

# UI Components
npm install react-native-vector-icons
npm install react-native-paper

# Loading indicators
npm install react-native-loading-spinner-overlay

# Date/Time
npm install date-fns
```

### Step 3: Platform-Specific Setup

#### Android Setup
```bash
# Link vector icons (if needed)
npx react-native link react-native-vector-icons

# For Android, update android/app/build.gradle:
# Add this line in the dependencies section:
# implementation project(':react-native-vector-icons')
```

#### iOS Setup (Mac only)
```bash
cd ios
pod install
cd ..
```

## Project Structure

```
SalonMobileApp/
├── src/
│   ├── api/
│   │   ├── apiClient.ts           # Axios configuration
│   │   ├── authAPI.ts             # Authentication endpoints
│   │   ├── servicesAPI.ts         # Services endpoints
│   │   ├── productsAPI.ts         # Products endpoints
│   │   ├── staffAPI.ts            # Staff endpoints
│   │   ├── invoicesAPI.ts         # Invoices endpoints
│   │   └── customerAPI.ts         # Customer endpoints
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorMessage.tsx
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   └── ServiceForm.tsx
│   │   └── lists/
│   │       ├── ServiceList.tsx
│   │       └── ProductList.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx       # Main navigation
│   │   ├── AuthNavigator.tsx      # Auth stack
│   │   └── MainNavigator.tsx      # Main app stack
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   ├── billing/
│   │   │   └── BillingScreen.tsx
│   │   ├── services/
│   │   │   └── ServicesScreen.tsx
│   │   ├── products/
│   │   │   └── ProductsScreen.tsx
│   │   ├── staff/
│   │   │   └── StaffScreen.tsx
│   │   └── reports/
│   │       └── ReportsScreen.tsx
│   ├── store/
│   │   ├── index.ts               # Redux store
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── servicesSlice.ts
│   │   │   └── productsSlice.ts
│   │   └── hooks.ts               # Typed Redux hooks
│   ├── utils/
│   │   ├── storage.ts             # AsyncStorage helpers
│   │   ├── validators.ts          # Form validators
│   │   └── formatters.ts          # Data formatters
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── service.types.ts
│   │   ├── product.types.ts
│   │   └── navigation.types.ts
│   ├── constants/
│   │   ├── api.ts                 # API endpoints
│   │   └── theme.ts               # App theme
│   └── App.tsx                     # Root component
├── android/                        # Android native code
├── ios/                           # iOS native code
├── package.json
└── tsconfig.json
```

## Key Configuration

### API Base URL Configuration
Your .NET API is running on `http://localhost:5000/api`

For mobile development:
- **Android Emulator**: Use `http://10.0.2.2:5000/api`
- **iOS Simulator**: Use `http://localhost:5000/api`
- **Physical Device**: Use your computer's IP address `http://192.168.x.x:5000/api`

## Running the App

### Android
```bash
# Start Metro bundler
npm start

# In another terminal, run Android
npm run android
```

### iOS (Mac only)
```bash
# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios
```

## Next Steps

1. Follow the detailed implementation files in the `implementation/` folder
2. Configure your API base URL based on your development environment
3. Test authentication flow with your existing .NET backend
4. Implement screens one by one
5. Add proper error handling and loading states
6. Test on both Android and iOS platforms

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**
   ```bash
   npm start -- --reset-cache
   ```

2. **Android build issues**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

3. **iOS build issues (Mac only)**
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   ```

## Security Considerations

1. **Never commit sensitive data** (API keys, tokens)
2. **Use environment variables** for configuration
3. **Implement proper token refresh** mechanism
4. **Use HTTPS** in production
5. **Implement certificate pinning** for production apps

## Performance Tips

1. Use **React.memo** for expensive components
2. Implement **pagination** for large lists
3. Use **FlatList** instead of ScrollView for long lists
4. Implement **image caching** for better performance
5. Use **useMemo** and **useCallback** hooks appropriately

## Testing

1. **Unit Tests**: Jest (included by default)
2. **Component Tests**: React Native Testing Library
3. **E2E Tests**: Detox or Appium

## Deployment

### Android
1. Generate signing key
2. Configure build.gradle
3. Build release APK/AAB
4. Upload to Google Play Console

### iOS
1. Configure Xcode project
2. Generate signing certificates
3. Build archive
4. Upload to App Store Connect

## Additional Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Axios Documentation](https://axios-http.com/)
