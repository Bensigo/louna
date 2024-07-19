import { Redirect, Stack } from "expo-router"
import { SignedOut, useAuth } from "@clerk/clerk-expo"

import { LeftBackButton } from "../_layout"

const Auth = () => {
    const { isSignedIn } = useAuth()

    if (isSignedIn) {
        return <Redirect href="/today" />
    }

    return (
        <SignedOut>
                <Stack
                    screenOptions={
                        {
                            // headerShown: false,
                        }
                    }
                >
                    <Stack.Screen
                        name="index"
                        options={{ headerShown: false }}
                    ></Stack.Screen>

                    <Stack.Screen
                        name="login"
                        options={{
                            headerTitle: "",
                            headerTransparent: true,
                            headerLeft: () => <LeftBackButton  route='/signup' />,
                        }}
                    />
                    <Stack.Screen
                        name="signup"
                        options={{
                            headerTitle: "",
                            headerTransparent: true,
                            headerLeft: () => <LeftBackButton route='/' />,
                        }}
                    />

                </Stack>
        </SignedOut>
    )
}

export default Auth
