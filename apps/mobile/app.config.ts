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
        bundleIdentifier: "your.bundle.identifier",
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/solu.png",
            backgroundColor: "#FAF9F6",
        },
    },
    extra: {
        eas: {
            // projectId: "your-project-id",
        },
        CLERK_PUBLISHABLE_KEY,
    },
    plugins: ["./expo-plugins/with-modify-gradle.js"],
})

export default defineConfig
