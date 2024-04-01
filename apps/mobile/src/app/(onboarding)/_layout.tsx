import React, { useEffect, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Stack, usePathname, useRootNavigation } from "expo-router"
import { SignedIn } from "@clerk/clerk-expo"
import { Progress } from "tamagui"

import { LeftBackButton } from "../_layout"
import { PrefProvider } from "../../context/usePref"

const OnboardingScreen = () => {
    const insets = useSafeAreaInsets()
    const rootNav = useRootNavigation()
    const path = usePathname()

    const [isProgressVisible, setProgressVisible] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const delayProgressDisplay = setTimeout(() => {
            if (path.startsWith("/question") && rootNav?.isReady()) {
                setProgressVisible(true)
                switch (path) {
                    case "/questionOne":
                        setProgress(10)
                        break
                    case "/questionTwo":
                        setProgress(20)
                        break
                    case "/questionThree":
                        setProgress(30)
                        break
                    case "/questionFour":
                        setProgress(40)
                        break
                    case "/questionFive":
                        setProgress(50)
                        break
                    case "/questionSix":
                        setProgress(60)
                        break
                    case "/questionSeven":
                        setProgress(70)
                        break

                    case "/questionEight":
                        setProgress(80)
                        break
                    case "/questionNine":
                        setProgress(90)
                        break
                    case "/questionTen":
                        setProgress(95)
                        break
                    case "/questionEleven":
                        setProgress(100)
                        break
                    default:
                        setProgress(0)
                }
            } else {
            }
        }, 1000) // Adjust delay as needed
        const reset = (() => {
            setProgress(0)
            setProgressVisible(false)
            return delayProgressDisplay
        })()

        return () => clearTimeout(reset)
    }, [path, rootNav])

    return (
        <PrefProvider>
            <SignedIn>
                <Stack>
                    <Stack.Screen
                        name="index"
                        options={{
                            headerShown: false,
                            headerTitle: "",
                            headerTransparent: true,
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="questionOne"
                        options={{
                            title: "",
                            headerTransparent: true,
                            headerLeft: () => (
                                <LeftBackButton route="/(onboarding)" />
                            ),
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="questionTwo"
                        options={{
                            title: "",
                            headerTransparent: true,
                            headerLeft: () => (
                                <LeftBackButton route="/(onboarding)/questionOne" />
                            ),
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="questionThree"
                        options={{
                            title: "",
                            headerTransparent: true,
                            headerLeft: () => (
                                <LeftBackButton route="/(onboarding)/questionTwo" />
                            ),
                        }}
                    ></Stack.Screen>

                    <Stack.Screen
                        name="questionFour"
                        options={{
                            title: "",
                            headerTransparent: true,
                            headerLeft: () => (
                                <LeftBackButton route="/(onboarding)/questionThree" />
                            ),
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="questionFive"
                        options={{
                            title: "",
                            headerTransparent: true,
                            headerLeft: () => (
                                <LeftBackButton route="/(onboarding)/questionFour" />
                            ),
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="recipeWelcome"
                        options={{
                            title: "",
                            headerTransparent: true,
                            headerLeft: () => (
                                <LeftBackButton route="/(onboarding)/questionFour" />
                            ),
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="questionSix"
                        options={{
                            title: "",
                            headerTransparent: true,
                            headerLeft: () => (
                                <LeftBackButton route="/(onboarding)/recipeWelcome" />
                            ),
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="questionSeven"
                        options={{
                            title: "",
                            headerTransparent: true,
                            headerLeft: () => (
                                <LeftBackButton route="/(onboarding)/questionSix" />
                            ),
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="questionEight"
                        options={{
                            title: "",
                            headerTransparent: true,
                            headerLeft: () => (
                                <LeftBackButton route="/(onboarding)/questionSeven" />
                            ),
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="questionNine"
                        options={{
                            title: "",
                            headerTransparent: true,
                            headerLeft: () => (
                                <LeftBackButton route="/(onboarding)/questionEight" />
                            ),
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="wellnessWelcome"
                        options={{
                            title: "",
                            headerTransparent: true,
                            headerLeft: () => (
                                <LeftBackButton route="/(onboarding)/questionNine" />
                            ),
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="questionTen"
                        options={{
                            title: "",
                            headerTransparent: true,
                            headerLeft: () => (
                                <LeftBackButton route="/(onboarding)/wellnessWelcome" />
                            ),
                        }}
                    ></Stack.Screen>
                    <Stack.Screen
                        name="questionEleven"
                        options={{
                            title: "",
                            headerTransparent: true,
                            headerLeft: () => (
                                <LeftBackButton route="/(onboarding)/questionTen" />
                            ),
                        }}
                    ></Stack.Screen>
                </Stack>
                {isProgressVisible && (
                    <Progress
                        top={12}
                        position="absolute"
                        marginVertical={10}
                        borderRadius={0}
                        size={"$2"}
                        height={"$0.5"}
                        value={progress}
                    >
                        <Progress.Indicator
                            backgroundColor={"$green7"}
                            animation="lazy"
                        />
                    </Progress>
                )}
            </SignedIn>
        </PrefProvider>
    )
}

export default OnboardingScreen
