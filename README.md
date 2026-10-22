# Netcon VPN

The Android app is a native Jetpack Compose application using Android `VpnService` and the bundled Xray core. It does not load a WebView or package web assets. The repository also contains a separate browser client; it is not used to build the Android app.

## Build Android debug APK and AAB

Requirements: Java 21 and Android SDK platform/build tools 36.

```sh
bash scripts/fetch-android-core.sh
cd android
./gradlew testDebugUnitTest assembleDebug bundleDebug
```

Outputs:

- APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- AAB: `android/app/build/outputs/bundle/debug/app-debug.aab`

These debug artifacts use the debug signing key and are for testing, not Play Store publishing. See [docs/android-release.md](./docs/android-release.md) for signed release builds.