This part covers the tools and settings to build and run a Roll-a-Ball game on a Meta Quest headset. The goal is simple: get a working `.apk` running on the device before we touch gameplay code.

# Installing the required apps

## A) Meta Horizon app (mobile)

Install Meta Horizon on your phone. Pair the phone with the headset and then enable Developer Mode.

## B) Meta Quest Developer Hub (MQDH) (desktop)

Install Meta Quest Developer Hub on your PC. Enable USB debugging so you can install/uninstall `.apk` builds quickly.

Sign in with the same Meta account used on the headset. Then connect the headset via USB and accept the USB Debugging prompt inside the headset.

# Turn on Developer Mode for the headset

To build and run apps, the headset must be in Developer Mode. Create a Meta Developer account (Meta Developer Dashboard). In the Meta Horizon mobile app go to Menu → Devices → Developer Mode and toggle Developer Mode On.

# Set up Android build support in Unity

To build a Quest `.apk`, Unity must have Android modules installed.

In Unity Hub, find the Unity version you are using and install Android Build Support, Android SDK & NDK Tools, and OpenJDK.

# Unity project settings for Quest VR

## A) Switch platform to Android (or Meta Quest)

In the Unity project go to File → Build Settings and select Android (or Meta Quest), then click Switch Platform.

## B) Set texture compression

Set Texture Compression to ASTC (recommended for Quest).

## C) Enable XR for Quest (OpenXR)

Go to Edit → Project Settings → XR Plug-in Management. Under Android, enable OpenXR.

Then go to Project Settings → XR Plug-in Management → OpenXR.

Recommended settings:
- Enable Meta Quest support / Oculus profile (depends on Unity version).
- Stereo Rendering Mode: Multiview (good performance on Quest).
- Enable the relevant OpenXR interaction profiles (Meta/Oculus controller profile).

If you use XR Interaction Toolkit, it typically expects OpenXR + the Input System.

# Player settings (Android)

Go to Edit → Project Settings → Player → Android.

Recommended settings:
- Scripting Backend: IL2CPP
- Target Architectures: ARM64 (Quest requires 64-bit)
- Minimum API Level: choose a Quest-compatible Android version (use Unity/Meta recommendations)
- Active Input Handling: Input System Package (or Both if you still use the old input)
- Color Space: Linear (recommended for modern lighting; keep consistent with your pipeline)
- Graphics API: Vulkan (or OpenGLES3 depending on your project and render pipeline)

Optional but useful:
- Package Name (e.g., `com.yourname.rollaballvr`)
- Company Name / Product Name
- App icon (makes it easier to find on the headset)

# Add the correct scene(s) to Build Settings

Even if the Scene view looks correct in the editor, the device build will show an empty world if your intended scene is not included in the build.

Go to File → Build Settings.

Make sure:
- Your VR scene (e.g., `MiniGame.unity`) is checked and listed.
- It is placed at the top if it should be the first scene loaded.

This is one of the most common “works in editor, empty in headset” causes.

# Build and run on the headset

From Unity:
- Go to File → Build Settings.
- Ensure the headset is connected and recognized.
- Click Build And Run.

If the app installs but you see a blank scene:
- Confirm the correct scene order in Build Settings.
- Confirm the scene contains an XR Origin / XR Rig and an XR-compatible camera setup.
- Check logs in MQDH (crashes or missing shaders show up quickly).
