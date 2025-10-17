# PPL Workout Tracker - APK Build Guide

## ✅ **COMPLETED SETUP**

### Dependencies Installed:
- ✅ Capacitor core, CLI, and Android platform
- ✅ All required Capacitor plugins (StatusBar, SplashScreen, Keyboard, Device, Network, Haptics)
- ✅ TypeScript for configuration
- ✅ Java 17 JDK for Android development

### Project Configuration:
- ✅ Capacitor initialized with app ID: `com.ppltracker.app`
- ✅ Android platform added
- ✅ React app built and synced with Capacitor
- ✅ Keystore created for signing: `ppl-tracker-release.keystore`
- ✅ Build configuration updated with signing configs
- ✅ Android permissions added (Internet, Network State, Vibrate, Wake Lock)

---

## 🔄 **CURRENT BUILD STATUS**

The Gradle build is currently running in the background. You can check the status by running:

```bash
cd /app/frontend/android
tail -f build.log
```

Or check if the build process is still running:
```bash
ps aux | grep gradle
```

---

## 📱 **WHEN BUILD COMPLETES**

### Expected Output Locations:

#### Debug APK:
```
/app/frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

#### Release APK (if built):
```
/app/frontend/android/app/build/outputs/apk/release/app-release.apk
```

### Build Commands:

```bash
# Set Java environment
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64

# Navigate to Android directory
cd /app/frontend/android

# Build Debug APK (for testing)
./gradlew assembleDebug

# Build Release APK (for Play Store)
./gradlew assembleRelease

# Build AAB (Android App Bundle - preferred for Play Store)
./gradlew bundleRelease
```

---

## 🏗️ **BUILD TROUBLESHOOTING**

### If Build Fails:

1. **Check Build Log**:
```bash
cd /app/frontend/android
cat build.log
```

2. **Clean and Retry**:
```bash
./gradlew clean
./gradlew assembleDebug
```

3. **Check Keystore Issues**:
```bash
# Verify keystore exists
ls -la ppl-tracker-release.keystore

# Check key.properties file
cat key.properties
```

### Common Issues and Solutions:

#### Out of Memory:
```bash
# Edit gradle.properties and add:
echo "org.gradle.jvmargs=-Xmx2048m" >> gradle.properties
```

#### Signing Issues:
- Ensure keystore file exists in `/app/frontend/android/`
- Verify key.properties has correct paths and passwords

---

## 📋 **POST-BUILD STEPS**

### 1. Verify APK Generation:
```bash
cd /app/frontend/android
find . -name "*.apk" -type f
```

### 2. Test APK Installation:
- Transfer APK to Android device
- Enable "Install from Unknown Sources"
- Install and test the app

### 3. For Play Store (Release Build):
```bash
# Generate AAB (preferred format)
./gradlew bundleRelease

# Output will be at:
# app/build/outputs/bundle/release/app-release.aab
```

---

## 🚀 **DEPLOYMENT OPTIONS**

### Option 1: Direct APK Installation
- Use the debug APK for testing
- Install directly on Android devices
- Good for internal testing and distribution

### Option 2: Google Play Store
- Use the AAB file (app-release.aab)
- Upload to Google Play Console
- Follows the playstore-guide.md instructions

### Option 3: Alternative App Stores
- APK can be uploaded to Amazon Appstore, Samsung Galaxy Store, etc.
- Each store has different requirements

---

## 📁 **PROJECT STRUCTURE**

```
/app/frontend/
├── android/                    # Native Android project
│   ├── app/
│   │   ├── build/
│   │   │   └── outputs/
│   │   │       ├── apk/        # APK files here
│   │   │       └── bundle/     # AAB files here
│   │   └── src/main/
│   ├── key.properties          # Signing configuration
│   └── ppl-tracker-release.keystore # Signing keystore
├── build/                      # React build output
├── src/                        # React source code
├── capacitor.config.ts         # Capacitor configuration
└── package.json               # Dependencies
```

---

## ⚡ **QUICK COMMANDS REFERENCE**

```bash
# Check build status
cd /app/frontend/android && tail -f build.log

# Kill build if stuck
pkill -f gradle

# Restart build
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
cd /app/frontend/android
./gradlew assembleDebug

# Check for generated APK
find /app/frontend/android -name "*.apk" -type f

# Get APK size and info
ls -lh /app/frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎯 **NEXT STEPS AFTER APK GENERATION**

1. **Test the APK** on an Android device or emulator
2. **Verify all app functionality** works in the mobile environment
3. **Create app store assets** (icons, screenshots, descriptions)
4. **Upload to Google Play Console** (using AAB file)
5. **Submit for review** and publish

---

## 📞 **GETTING HELP**

If you encounter issues:
1. Check the build.log file for specific error messages
2. Ensure all dependencies are installed correctly
3. Verify the Android SDK and Java versions
4. Make sure the keystore and signing configuration are correct

The build process typically takes 5-15 minutes depending on system resources. Once complete, you'll have a working Android APK ready for installation and testing!