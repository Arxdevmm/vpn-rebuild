# Android app and GitHub releases

The Android app uses a native Jetpack Compose screen and Android `VpnService` with the bundled Xray core. It does not load a WebView or package the separate browser interface. The native app accepts one VLESS, VMess, Trojan, or Shadowsocks link at a time, as well as Xray JSON with one supported outbound tagged `proxy`; parsing happens on-device. Imported configuration is stored in private app preferences with Android backup disabled. The app also accepts shared text and direct configuration links. Public-server browsing, QR scanning, and Gemini recommendations remain web-only.

## Local Android project

Requirements: Java 21, Android Studio, and Android SDK platform/build tools.

```sh
bash scripts/fetch-android-core.sh
cd android
./gradlew assembleDebug
```

Run `./gradlew testDebugUnitTest assembleDebug bundleDebug` to run the native parser tests and build debug APK/AAB artifacts. The APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`; the AAB is written to `android/app/build/outputs/bundle/debug/app-debug.aab`. Both are debug-signed and are for testing, not Play Store publishing. No web build or Capacitor sync is part of Android packaging. To regenerate Android launcher assets after changing the shared icon, run `npm run android:assets`.

## Configure GitHub releases

Add the following Actions secrets under **Settings > Secrets and variables > Actions**:

- Secret `ANDROID_KEYSTORE_BASE64`: base64-encoded Android release keystore.
- Secret `ANDROID_KEYSTORE_PASSWORD`: keystore password.
- Secret `ANDROID_KEY_ALIAS`: signing key alias.
- Secret `ANDROID_KEY_PASSWORD`: signing key password.

Generate a release keystore once and keep it backed up securely; losing it prevents updates from being signed as the same Android app:

```sh
keytool -genkeypair -v -keystore netcon-release.jks -keyalg RSA -keysize 4096 -validity 10000 -alias netcon
base64 -w 0 netcon-release.jks
```

Store the encoded output as `ANDROID_KEYSTORE_BASE64` and never commit the keystore or passwords. Push a new version tag such as `v1.0.4` to build, sign, verify, and attach `Netcon.apk` to a GitHub Release:

```sh
git tag v1.0.4
git push origin v1.0.4
```

If a tag push does not start Actions, run **Android release** from the Actions tab with the existing tag as `release_tag`. The manual run checks out that tag and publishes the same signed artifacts.

The release APK is signed for direct installation. Its version name comes from the tag, and its version code increments with each workflow run. Google Play distribution may require a separately configured Android App Bundle and Play signing.
