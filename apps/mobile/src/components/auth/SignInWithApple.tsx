/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from "react"
import * as AppleAuthentication from "expo-apple-authentication"
import * as WebBrowser from "expo-web-browser"
import { useOAuth } from "@clerk/clerk-expo"

import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser"

WebBrowser.maybeCompleteAuthSession()

type SignInWithAppleProps = {
    onDone: () => void
    isLogin?: boolean
}

const SignInWithApple = (props: SignInWithAppleProps) => {
    useWarmUpBrowser()

    const { startOAuthFlow } = useOAuth({ strategy: "oauth_apple", unsafeMetadata: { role: "USER" } })

    const onPress = useCallback(async () => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow()

            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId })
                props.onDone()
            }
        } catch (err) {
            console.error("OAuth error", err)
        }
    }, [])
    const BUTTON_TYPE = props.isLogin ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN : AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
    return (
        <AppleAuthentication.AppleAuthenticationButton
            buttonType={BUTTON_TYPE}
            buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            
            cornerRadius={4}
            style={{ width: "100%", height: 44, borderRadius: 100 }}
            onPress={onPress}
        >
         
        </AppleAuthentication.AppleAuthenticationButton>
    )
}

export { SignInWithApple }
