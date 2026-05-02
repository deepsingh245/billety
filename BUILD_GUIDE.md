# Multi-Platform Build Guide

This guide provides step-by-step instructions to build distributable files for Desktop, Android, and iOS using your current React + Vite codebase. These files are meant to be uploaded directly to GitHub Releases so users can download and install them without using App Stores.

---

## 1. Desktop Application (Windows, Mac, Linux)

To build the desktop application, run the command matching your current operating system (you cannot build macOS `.dmg` on Windows):

**For Windows (`.exe`):**
```bash
npm run build:desktop-win
```

**For Mac (`.dmg`):**
```bash
npm run build:desktop-mac
```

**For Linux (`.AppImage`):**
```bash
npm run build:desktop-linux
```

**Output:** The installer file (e.g., `Billety Setup x.x.x.exe`) will be generated inside the `release-desktop/` folder.

---

## 2. Mobile Applications (Android & iOS)

```bash
npx cap add android
npx cap add ios
```

### Build and Sync Assets
Before building for mobile, always make sure your latest code is built and synced to the mobile projects:
```bash
npm run cap:sync
```

---

### Building the Android APK
*Prerequisites: You need Java JDK and Android Studio installed on your computer.*

You can generate a downloadable `.apk` file right from your terminal without opening Android Studio.

**On Windows:**
```cmd
cd android
gradlew assembleDebug
cd ..
```
**On Mac/Linux:**
```bash
cd android
./gradlew assembleDebug
cd ..
```

**Output:** Your downloadable APK will be located at `android/app/build/outputs/apk/debug/app-debug.apk`. 
*(Note: Because this is a debug APK, Android devices will show a generic warning when installing, but it will install successfully without needing the Play Store).*

---

### Building the iOS App (.ipa)
*Prerequisites: You MUST be on a Mac with Xcode installed. Apple strictly prohibits compiling iOS apps on Windows.*

Unlike Android, Apple makes it difficult to install apps outside the App Store. Users will need tools like **AltStore** to sideload your `.ipa` file if it's not published.

1. Open the project in Xcode:
```bash
npx cap open ios
```
2. In Xcode, go to **Signing & Capabilities** and log in with your Apple ID.
3. Select **Any iOS Device (arm64)** as the target at the top.
4. Go to the top menu and select **Product > Archive**.
5. Once the archive is created, click **Distribute App**.
6. Select **Development** or **Ad Hoc** and proceed through the prompts to export the `.ipa` file to a folder on your Mac.

**Output:** An `.ipa` file that you can share.

---

## 3. Uploading to GitHub

Once you have your files (`.exe`, `.apk`, `.dmg`, etc.), you can make them downloadable on GitHub:

1. Go to your GitHub repository in the browser.
2. On the right-hand sidebar, click on **Releases**, then **Draft a new release**.
3. Choose a tag (e.g., `v1.0.0`) and a release title.
4. Drag and drop your compiled files (`Billety Setup.exe`, `app-debug.apk`, etc.) into the **Attach binaries by dropping them here** box.
5. Add some release notes and click **Publish release**.

Anyone who visits your repository can now go to the Releases page and download the app for their preferred platform!
