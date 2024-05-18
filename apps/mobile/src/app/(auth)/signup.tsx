/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Link } from "expo-router"
import { SignedOut } from "@clerk/clerk-expo"
import { Button, H2, H3, View, YStack } from "tamagui"

import { SignInWithApple } from "../../components/auth/SignInWithApple"
import { SignInWithGoogle } from "../../components/auth/SignInWithGoogle"
import { Colors } from "../../constants/colors"

function SignUp() {
    const onSignUp = () => {
        //
    }

    return (
        <SignedOut>
            <View
                bg={"#f5e6cf"}
                display="flex"
                flex={1}
                justifyContent="space-between"
                height={"100%"}
            >
                <View
                    flex={1}
                    marginVertical={"$14"}
                    marginHorizontal={"$3"}
                    justifyContent="space-between"
                >
                    <YStack mt={'$10'}>
                        <H2 color={Colors.dark.primary}  fontSize={"$10"}>
                            Let's get you started
                        </H2>
                        <H3 color={Colors.dark.primary}  fontWeight={"$2"} fontSize={"$8"}>
                            you deserve to be healthier, happy and whole.
                        </H3>
                    </YStack>

                    <YStack space={"$3"} mt="$2.5">
                        <SignInWithGoogle
                            onDone={onSignUp}
                            text="Sign Up with Google"
                        />
                        <SignInWithApple onDone={onSignUp} />
                        <Link href={"/login"} style={{  display: 'flex', alignSelf: 'center'}} asChild>
                            <Button variant="outlined" borderWidth={0}>
                                Already have an account? Login
                            </Button>
                        </Link>
                    </YStack>
                </View>
            </View>
        </SignedOut>
    )
}

export default SignUp
