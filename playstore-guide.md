# PPL Workout Tracker - Google Play Store Submission Guide

## Phase 3: Play Store Preparation & Submission

### Step 10: Create Google Play Console Account

1. **Go to Google Play Console**: https://play.google.com/console/
2. **Pay Registration Fee**: $25 (one-time fee)
3. **Complete Developer Profile**:
   - Developer name
   - Contact information
   - Tax information (if required)

### Step 11: Prepare App for Release

#### Update App Version and Build Number
```javascript
// In capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.yourcompany.ppltracker',
  appName: 'PPL Workout Tracker',
  // ... other config
};
```

#### Update android/app/build.gradle
```gradle
android {
    compileSdk 34
    defaultConfig {
        applicationId "com.yourcompany.ppltracker"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

### Step 12: Generate Signed APK/AAB

#### Create Keystore:
```bash
cd /app/frontend/android/app
keytool -genkey -v -keystore ppl-tracker-release.keystore -alias ppl-tracker -keyalg RSA -keysize 2048 -validity 25000
```

#### Create gradle.properties:
```properties
# android/gradle.properties
MYAPP_RELEASE_STORE_FILE=ppl-tracker-release.keystore
MYAPP_RELEASE_KEY_ALIAS=ppl-tracker
MYAPP_RELEASE_STORE_PASSWORD=your-keystore-password
MYAPP_RELEASE_KEY_PASSWORD=your-key-password
```

#### Update build.gradle for signing:
```gradle
android {
    signingConfigs {
        release {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### Build Release AAB:
```bash
cd /app/frontend
npm run build:mobile
cd android
./gradlew bundleRelease
```

### Step 13: App Store Listing Requirements

#### Required Assets:
1. **App Icon** (512x512 PNG)
2. **Feature Graphic** (1024x500 PNG/JPG)
3. **Screenshots** (minimum 2, maximum 8):
   - Phone: 320dp to 3840dp wide, 16:9 to 2:1 ratio
   - 7-inch tablet: 320dp to 3840dp wide
   - 10-inch tablet: 320dp to 3840dp wide

#### App Description Template:
```
Title: PPL Workout Tracker - Build Muscle & Strength

Short Description (80 chars):
Transform your physique with the ultimate Push/Pull/Legs workout program!

Long Description:
🏋️ **TRANSFORM YOUR PHYSIQUE WITH THE ULTIMATE PPL PROGRAM**

The PPL Workout Tracker is your complete companion for the scientifically-proven Push/Pull/Legs training methodology. Built around Jeff Nippard's 6-week periodized program, this app guides you through three distinct phases designed for maximum muscle growth and strength gains.

💪 **FEATURES:**
✅ 6-Week Periodized Program (Base Hypertrophy → Maximum Effort → Supercompensation)
✅ Smart Workout Scheduling with Rest Day Selection  
✅ Exercise Progress Tracking & History
✅ Interactive Calendar View
✅ Weight & Rep Logging
✅ Premium Black & White Design
✅ Offline Functionality

🎯 **PERFECT FOR:**
- Intermediate to Advanced Lifters
- Anyone Following PPL Split
- Muscle Building & Strength Goals
- Structured Progressive Overload

📊 **TRACK YOUR PROGRESS:**
- Log weights for every exercise
- View exercise-specific progress graphs
- Monitor weekly completion rates
- Calendar view of your training schedule

Start your transformation today with the most comprehensive PPL workout tracker available!

Keywords: workout tracker, PPL, push pull legs, muscle building, strength training, fitness, bodybuilding, progressive overload, Jeff Nippard
```

#### Privacy Policy (Required):
Create a privacy policy at: https://www.privacypolicygenerator.info/

### Step 14: Play Store Submission Process

#### Content Rating:
- Target audience: 13+ (teens and adults)
- Content rating: Everyone 10+
- No inappropriate content

#### App Categories:
- Primary: Health & Fitness
- Secondary: Sports

#### Pricing:
- Free app (recommended for initial launch)
- Future: Consider premium features or subscription

### Step 15: Upload & Submit

1. **Create App in Play Console**
2. **Upload AAB file** (android/app/build/outputs/bundle/release/app-release.aab)
3. **Complete Store Listing**:
   - Upload all required assets
   - Add app description
   - Set content rating
   - Add privacy policy link
4. **Set Up Content Rating Questionnaire**
5. **Review and Publish**

#### Typical Review Timeline:
- Initial review: 3-7 days
- Updates: 1-3 days (for existing apps)

### Step 16: Post-Launch

#### Analytics Setup:
- Google Analytics for Firebase
- Play Console Analytics
- Crashlytics for crash reporting

#### Marketing:
- Social media promotion
- Fitness community engagement
- Content marketing (workout tips, etc.)

#### Updates:
- Bug fixes and improvements
- New features based on user feedback
- Regular content updates

### Estimated Timeline:
- **Development & Testing**: 1-2 weeks
- **Play Store Setup**: 1-2 days  
- **Review Process**: 3-7 days
- **Total**: 2-3 weeks from start to live app

### Cost Breakdown:
- Google Play Developer Account: $25 (one-time)
- App assets creation: $0-200 (if hiring designer)
- Marketing: Variable
- **Total Minimum**: $25