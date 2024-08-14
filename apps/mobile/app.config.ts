import type { ExpoConfig } from "@expo/config";

const defineConfig = (): ExpoConfig => ({
  name: "lumi",
  slug: "lumi",
  scheme: "ae.lumiapp.app",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  backgroundColor: "#ffffff",
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
    backgroundColor: '#ffffff'
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
  plugins: [
    "./expo-plugins/with-modify-gradle.js",
    "expo-apple-authentication",
    "expo-secure-store",
    "expo-router",
    ["react-native-health", {
      // "isClinicalDataEnabled": true,
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
  ],
});

export default defineConfig;
