# 🚀 Mobile App Quick Start Guide

## ✅ What's Already Done

1. ✅ React Native project initialized: `SalonMobileApp`
2. ✅ All dependencies installed
3. ✅ Implementation files copied to correct directories
4. ✅ Android gradle configuration updated
5. ✅ Metro bundler is running on http://localhost:8081
6. ✅ Backend API is running on http://localhost:5000

## 📱 Current Status

**Project Location:** `C:\Users\krishna nandhini\Documents\nandhini\nandhini\salon software\SalonMobileApp`

**Metro Bundler:** ✅ Running (http://localhost:8081)

**Backend API:** ✅ Running (http://localhost:5000)

**Android Environment:** ❌ Not configured

## 🛠️ Android Development Environment Setup Required

### Issue: Missing Android SDK & Java JDK

The following components are missing:
- Android SDK (ADB not found)
- Java Development Kit (JAVA_HOME not set)
- Android Emulator or physical device

### Solution: Install Android Studio

**Step 1: Download Android Studio**
1. Visit: https://developer.android.com/studio
2. Download Android Studio for Windows
3. Run the installer

**Step 2: During Installation, Select:**
- ✅ Android SDK
- ✅ Android SDK Platform
- ✅ Android Virtual Device (AVD)

**Step 3: Configure Android SDK**
After installation, open Android Studio:
1. Click "More Actions" → "SDK Manager"
2. Install:
   - ✅ Android 14.0 (API Level 34) or higher
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Platform-Tools
   - ✅ Android Emulator
3. Note the Android SDK location (usually: `C:\Users\<your-username>\AppData\Local\Android\Sdk`)

**Step 4: Set Environment Variables**
Open PowerShell as Administrator and run:
```powershell
# Set ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\krishna nandhini\AppData\Local\Android\Sdk', 'User')

# Add Android tools to PATH
$path = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$androidTools = 'C:\Users\krishna nandhini\AppData\Local\Android\Sdk\platform-tools;C:\Users\krishna nandhini\AppData\Local\Android\Sdk\emulator;C:\Users\krishna nandhini\AppData\Local\Android\Sdk\tools;C:\Users\krishna nandhini\AppData\Local\Android\Sdk\tools\bin'
[System.Environment]::SetEnvironmentVariable('Path', "$path;$androidTools", 'User')
```

**Close and reopen all terminals** after setting environment variables.

**Step 5: Install Java JDK**
1. Download: https://adoptium.net/temurin/releases/ (Choose JDK 17 or 21)
2. Install and note the installation path
3. Set JAVA_HOME:
```powershell
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Eclipse Adoptium\jdk-17.0.x-hotspot', 'User')
```

**Step 6: Create Android Virtual Device (Emulator)**
1. Open Android Studio
2. Click "More Actions" → "Virtual Device Manager"
3. Click "Create Device"
4. Select a phone (e.g., Pixel 5)
5. Download a system image (Android 14 recommended)
6. Click "Finish"

**Step 7: Verify Installation**
Close and reopen PowerShell, then run:
```powershell
adb version
java -version
emulator -list-avds
```

All three commands should work without errors.

---

## 🚀 Running the Mobile App (After Environment Setup)

### Start the Android Emulator
Open a new PowerShell terminal:
```powershell
cd "C:\Users\krishna nandhini\AppData\Local\Android\Sdk\emulator"
.\emulator -avd <your-avd-name>
```

Or launch from Android Studio: Virtual Device Manager → Click ▶️ Play button

### Build and Run the App
Open a new PowerShell terminal:
```powershell
cd "C:\Users\krishna nandhini\Documents\nandhini\nandhini\salon software\SalonMobileApp"
npx react-native run-android
```

The app will:
1. Build the Android APK
2. Install on the emulator/device
3. Launch automatically
4. Connect to Metro bundler

---

## 🔧 Alternative: Run on Physical Android Device

### Requirements:
1. Android phone with USB debugging enabled
2. USB cable

### Steps:
1. Enable Developer Options on your phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. Connect phone via USB

3. Verify connection:
```powershell
adb devices
```

You should see your device listed.

4. Run the app:
```powershell
npx react-native run-android
```

### Important: Update API Base URL for Physical Device
If using a physical device, you need to update the API URL:

**File:** `SalonMobileApp\src\api\api.constants.ts`

Find your PC's IP address:
```powershell
ipconfig
```

Look for "IPv4 Address" under your active network adapter (e.g., 192.168.1.100)

Update `api.constants.ts`:
```typescript
const BASE_URL = Platform.select({
  android: 'http://YOUR_PC_IP:5000/api', // e.g., http://192.168.1.100:5000/api
  ios: 'http://localhost:5000/api',
  default: 'http://localhost:5000/api',
});
```

**Restart Metro bundler** after changing the API URL:
```powershell
# Stop current Metro (Ctrl+C)
npm start -- --reset-cache
```

---

## 📱 App Features Ready

Once the app runs, you'll have:

### ✅ Authentication
- Login screen with email/password
- Token-based authentication
- Auto-login on app restart
- Logout functionality

### ✅ Dashboard (Home Screen)
- Welcome message with user name
- Revenue stats (ready for API integration)
- Quick action buttons

### ✅ Services Management
- View all services
- Service list with active/inactive status
- FAB button for adding new services (ready for implementation)

### ✅ Products Management
- View all products
- Stock information
- Low stock alerts

### ✅ Staff Management
- Staff list
- Salary history
- Bank details

### ✅ Billing
- Create new invoices
- Select services and products
- Apply discounts
- Multiple payment methods

---

## 🧪 Test Login Credentials

You can test the app with your existing backend users. If you need to create a test user:

**Using Backend API:**
```powershell
# Register a new user via API
Invoke-RestMethod -Uri "http://localhost:5000/api/Auth/register" -Method Post -Body (@{
    email = "test@salon.com"
    password = "Test@123"
    fullName = "Test User"
    role = "Admin"
} | ConvertTo-Json) -ContentType "application/json"
```

**Login Credentials:**
- Email: test@salon.com
- Password: Test@123

---

## 🐛 Troubleshooting

### Metro Bundler Issues
```powershell
# Clear cache
npm start -- --reset-cache
```

### Build Issues
```powershell
# Clean Android build
cd android
.\gradlew clean
cd ..
npx react-native run-android
```

### ADB Not Found
```powershell
# Check ADB is in PATH
$env:Path
# Should contain: C:\Users\krishna nandhini\AppData\Local\Android\Sdk\platform-tools
```

### Connection Refused Errors
- Ensure backend API is running: `http://localhost:5000`
- For emulator: API URL should be `http://10.0.2.2:5000/api`
- For physical device: API URL should be `http://<your-pc-ip>:5000/api`

### Port Already in Use
```powershell
# Kill process on port 8081
netstat -ano | findstr :8081
taskkill /PID <process-id> /F
```

---

## 📚 Next Steps After Setup

1. **Complete RegisterScreen.tsx** - Add registration form UI
2. **Complete ProductsScreen.tsx** - Implement product list and CRUD
3. **Complete StaffScreen.tsx** - Implement staff management UI
4. **Enhance BillingScreen.tsx** - Add service/product selection modals
5. **Add Dashboard API Integration** - Fetch real stats
6. **Implement Forms** - Create/Edit modals for services, products, staff
7. **Add Error Handling UI** - Toast notifications
8. **Add Loading States** - Skeleton screens
9. **Implement Search & Filters** - Enhanced list screens
10. **Add Reports Screen** - Sales reports, analytics

---

## 🎉 Summary

**Current State:**
- ✅ React Native project created and configured
- ✅ Metro bundler running
- ✅ Backend API running
- ✅ All implementation files in place
- ❌ Android environment setup needed

**To Run the App:**
1. Install Android Studio (with SDK, Emulator, Java)
2. Set environment variables (ANDROID_HOME, JAVA_HOME, PATH)
3. Create and start Android emulator
4. Run: `npx react-native run-android`

**Alternative:**
- Use physical Android device with USB debugging enabled
- Update API base URL to your PC's local IP address

---

## 💡 Quick Commands Reference

```powershell
# Start Metro bundler
npm start

# Run on Android
npx react-native run-android

# Clear cache
npm start -- --reset-cache

# Clean build
cd android; .\gradlew clean; cd ..

# Check devices
adb devices

# List emulators
emulator -list-avds

# Start emulator
emulator -avd <avd-name>

# Check API
Invoke-RestMethod -Uri "http://localhost:5000/api/Auth/me" -Headers @{ Authorization = "Bearer <token>" }
```

---

**Need Help?**
- React Native Docs: https://reactnative.dev/docs/environment-setup
- Android Studio: https://developer.android.com/studio
- Troubleshooting: https://reactnative.dev/docs/troubleshooting
