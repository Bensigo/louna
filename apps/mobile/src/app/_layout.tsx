/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { Suspense, useEffect } from "react"
import { useColorScheme } from "react-native"
import Constants from "expo-constants"
import { useFonts } from "expo-font"
import { Stack, useRouter } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { ClerkProvider } from "@clerk/clerk-expo"
import FontAwesomIcon from "@expo/vector-icons/FontAwesome"
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native"
import { Button, TamaguiProvider, Text, Theme } from "tamagui"

import config from "../../tamagui.config"
import { TRPCProvider } from "../utils/api"
import { tokenCache } from "../utils/cache"
import { CustomTabbarProvider } from "../context/useCustomTabbar"

void SplashScreen.preventAutoHideAsync()

export const LeftBackButton = ({ route, bg }: { route?: string, bg?: string  }) => {
    const router = useRouter()
    return (
        <Button
            unstyled
            py="$2"
            pr="$2"
            mt={3}
            onPress={() => {
                if (route){
                    router.replace(route)
                }else {
                    router.back()
                }
            }}
            icon={<FontAwesomIcon size={20} name="chevron-left" color={bg ? bg: 'black'} />}
        ></Button>
    )
}

const RootLayout = () => {
    const colorScheme = useColorScheme()

    const [loaded] = useFonts({
        Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
        InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    })

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync()
        }
    }, [loaded])

    if (!loaded) return null

    return (
        <TamaguiProvider config={config}>
            <ClerkProvider
                publishableKey={
                    Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY as string
                }
                tokenCache={tokenCache}
            >
                <Suspense fallback={<Text>Loading...</Text>}></Suspense>
                <TRPCProvider>
                    <Theme name={colorScheme}>
                        <ThemeProvider
                            value={
                                colorScheme === "light"
                                    ? DefaultTheme
                                    : DarkTheme
                            }
                        >
                            <CustomTabbarProvider>
                            <Stack>
                                <Stack.Screen
                                    name="(auth)"
                                    options={{ headerShown: false }}
                                ></Stack.Screen>
                                 <Stack.Screen
                                    name="profile"
                                    options={{ headerShown: false }}
                                ></Stack.Screen>
                                <Stack.Screen
                                    name="(tabs)"
                                    options={{ headerShown: false }}
                                ></Stack.Screen>

<Stack.Screen
                                    name="(onboarding)"
                                    options={{ headerShown: false }}
                                ></Stack.Screen>
                            </Stack>
                            </CustomTabbarProvider>
                        </ThemeProvider>
                    </Theme>
                </TRPCProvider>
            </ClerkProvider>
        </TamaguiProvider>
    )
}

export default RootLayout
