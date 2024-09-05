import type { ExpoConfig } from "@expo/config";

const defineConfig = (): ExpoConfig => ({
  name: "lumi",
  slug: "lumi",
  scheme: "ae.lumiapp.app",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "ae.lumi.app",
    supportsTablet: true,
    usesAppleSignIn: true,
    backgroundColor: '#fff',
    infoPlist: {
      "UIBackgroundModes": [ "fetch", "remote-notification"]
    }
  },
  android: {
    package: "your.bundle.identifier",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#18181A",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  // extra: {
  //   eas: {
  //     projectId: "your-project-id",
  //   },
  // },
  "packagerOpts": {
    "config": "metro.config.js",
    "sourceExts": ["js", "jsx", "ts", "tsx", "svg"]
  },
  plugins: [
    "./expo-plugins/with-modify-gradle.js",
    "expo-apple-authentication",
    "expo-secure-store",
    "expo-router",
  ["@kingstinct/react-native-healthkit", {
    "NSHealthShareUsageDescription": "Allow app to access your health data",
    "NSHealthUpdateUsageDescription": false,  // if you have no plans to update data, you could skip adding it to your info.plist
    "background": true 
  }],
    [
      "expo-build-properties",
      {
        ios: {
          deploymentTarget: "14.0",
          useFrameworks: "static",
        },
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission:
          "The app accesses your photos to let you share them with your friends.",
      },
    ],
    [
      "expo-calendar",
      {
        "calendarPermission": "The app needs to access your calendar."
      }
    ]
  ],
});

export default defineConfig;
