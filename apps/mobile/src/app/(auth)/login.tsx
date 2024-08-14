import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { useRouter } from "expo-router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button, H1, Input, Text, View, XStack, YStack } from "tamagui";

import type { AuthData } from "~/components/googleAuth";
import { colorScheme } from "../../constants/colors";
import { initiateAppleSignIn } from "../../utils/auth";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { error, data } = await supabase.auth.signInWithOtp({
        email,
        options: {},
      });
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      router.push({
        pathname: "/verify",
        params: {
          email,
        },
      });
    } catch (err) {
      console.error("Error sending magic link:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const goToRegister = () => router.push("/register");

  const signInWithApple = async () => {
    try {
      const { token, nonce } = await initiateAppleSignIn();
      const { error, data } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token,
        nonce,
      });

      if (error) return Alert.alert("Error", error.message);
      router.push("/home");
    } catch (e) {
      if (typeof e === "object" && !!e && "code" in e) {
        if (e.code === "ERR_REQUEST_CANCELED") {
          // handle that the user canceled the sign-in flow
        } else {
          // handle other errors
        }
      } else {
        console.error("Unexpected error from Apple SignIn: ", e);
      }
    }
  };

  const handleSigninWithGoogle = (data: AuthData) => {
    // handle sign wih google
    if (data.session?.user) {
      router.push("/home");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, paddingHorizontal: 20 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          flex={1}
        
          alignItems="center"
          justifyContent="center"
        >
          <YStack alignItems="center" mb={70}>
            <H1 color={colorScheme.primary.lightGreen} fontWeight="bold">
              Louna
            </H1>
            <Text color={colorScheme.secondary.darkGray} fontSize={13}>
            Living healthly can be fun

            </Text>
          </YStack>
          <YStack gap="$3" width={"100%"}>
            <Input
              placeholder="you@mail.com"
              value={email}
              onChangeText={setEmail}
              borderWidth={0}
              backgroundColor={'white'}
              borderRadius={5}
              paddingHorizontal="$4"
              paddingVertical="$3"
              fontSize={16}
              color={"black"}
            />
            <Button
              backgroundColor={colorScheme.primary.green}
              color="white"
              borderRadius={10}
              paddingHorizontal="$4"
              paddingVertical="$2"
              fontSize={14}
              height={40}
              marginBottom={10}
              fontWeight="bold"
              onPress={handleLogin}
            >
              {isLoading ? <ActivityIndicator size={"small"} /> : "Login"}
            </Button>
            {error ? <Text color="red">{error}</Text> : null}
            {message ? <Text color="green">{message}</Text> : null}
            <TouchableWithoutFeedback onPress={goToRegister}>
              <Text
                color={colorScheme.secondary.gray}
                textAlign="center"
                lineHeight={14}
              >
                Don't have an account? Signup
              </Text>
            </TouchableWithoutFeedback>
            {!keyboardVisible && (
              <YStack gap="$4">
                <XStack alignItems="center" justifyContent="center" space="$4">
                  <Text
                    backgroundColor="$zinc800"
                    paddingHorizontal="$2"
                    fontSize="$4"
                    color="black"
                  >
                    or
                  </Text>
                </XStack>
                {/* <SignInWithGoogleAuth onAuth={handleSigninWithGoogle} /> */}

                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={
                    AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                  }
                  buttonStyle={
                    AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                  }
                  cornerRadius={8}
                  onPress={signInWithApple}
                  style={{ height: 40 }}
                />
              </YStack>
            )}
          </YStack>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
