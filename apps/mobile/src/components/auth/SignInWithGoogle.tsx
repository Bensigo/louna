/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react"
import * as WebBrowser from "expo-web-browser"
import { useOAuth } from "@clerk/clerk-expo"
import FontAwesomIcon from "@expo/vector-icons/FontAwesome"
import { Button } from "tamagui"

import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser"

WebBrowser.maybeCompleteAuthSession()

type SignInWithGoogleProps = {
    onDone: () => void
    text: string
}

const SignInWithGoogle = (props: SignInWithGoogleProps) => {
    useWarmUpBrowser()

    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google", unsafeMetadata: { role: "USER" } })

    const onPress = useCallback(async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow()

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId })
                props.onDone()
            } else {
                // Use signIn or signUp for next steps such as MFA
            }
        } catch (err) {
            console.error("OAuth error", err)
        }
    }, [])

    return (
        <Button
            p={"$2"}
            onPress={onPress}
            icon={<FontAwesomIcon name="google" size={17} />}
        >
           {props.text} 
        </Button>
    )
}

export { SignInWithGoogle }
