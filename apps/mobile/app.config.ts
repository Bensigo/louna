import type { ExpoConfig } from "@expo/config"

const CLERK_PUBLISHABLE_KEY =
    "pk_test_cmFyZS1tb2NjYXNpbi04Mi5jbGVyay5hY2NvdW50cy5kZXYk"
const defineConfig = (): ExpoConfig => ({
    name: "Solu",
    slug: "Solu",
    scheme: "Solu",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/solu.png",
    userInterfaceStyle: "light",
    splash: {
        image: "./assets/solu.png",
        resizeMode: "contain",
        backgroundColor: "#FAF9F6",
    },
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: true,
        bundleIdentifier: "ae.soluapp.app",
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/solu.png",
            backgroundColor: "#FAF9F6",
        },
    },
    extra: {
        eas: {
            projectId: "80a3324e-3bd7-466b-81e9-767e1e324a23",
        },
        CLERK_PUBLISHABLE_KEY,
    },
    plugins: ["./expo-plugins/with-modify-gradle.js", "expo-font",
    "expo-secure-store", ["react-native-health", {
        "isClinicalDataEnabled": true,
    }]],
})

export default defineConfig
