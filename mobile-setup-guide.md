# PPL Workout Tracker - Mobile App Setup Guide

## Phase 2: Mobile Development Environment Setup

### Prerequisites Installation

#### 1. Install Android Studio
- Download from: https://developer.android.com/studio
- Install with Android SDK, Android SDK Platform-Tools, Android Virtual Device

#### 2. Install Java Development Kit (JDK)
```bash
# Install JDK 11 or later
sudo apt install openjdk-11-jdk  # Ubuntu/Debian
brew install openjdk@11          # macOS
```

#### 3. Set Environment Variables
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64  # Ubuntu path
```

### Step 7: Create App Resources

#### Required App Icons (create these images):
- **app-icon.png** (1024x1024) - High-res icon
- **app-icon-round.png** (1024x1024) - Rounded version
- **splash-screen.png** (2732x2732) - Splash screen background

#### Icon Generator Tool:
Use online tools like:
- https://icon.kitchen/
- https://appicon.co/
- https://makeappicon.com/

### Step 8: Update App Configuration

Create the following files in `/app/frontend/android/app/src/main/res/`:

#### strings.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">PPL Workout Tracker</string>
    <string name="title_activity_main">PPL Workout Tracker</string>
    <string name="package_name">com.yourcompany.ppltracker</string>
    <string name="custom_url_scheme">com.yourcompany.ppltracker</string>
</resources>
```

#### AndroidManifest.xml permissions:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

### Step 9: Build and Test

#### Build for Development:
```bash
cd /app/frontend
npm run build:mobile
npx cap open android
```

#### Test on Emulator:
1. Open Android Studio
2. Create Virtual Device (API 30+)
3. Run the app from Android Studio

#### Test on Physical Device:
1. Enable Developer Options on Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run: `npx cap run android --target [DEVICE_ID]`
