import { Stack } from "expo-router"

import { LeftBackButton } from "../../../app/_layout"
import { CustomSaveAreaView } from "../../../components/CustomSaveAreaView"

const LayoutView = () => {
    return (
        <CustomSaveAreaView>
            <Stack >
                <Stack.Screen
                    name="index"
                    options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                    name="articles"
                    options={{
                        title: "Articles",
                        headerShadowVisible: false,
                       headerStyle: {
                        backgroundColor: 'transparent',
                       },
                        headerLeft: () => (
                            <LeftBackButton route="/profile" bg="black" />
                        ),
                    }}
                ></Stack.Screen>
                 <Stack.Screen
                    name="settings"
                    options={{
                        title: "Settings",
                         headerShadowVisible: false,
                         headerStyle: {
                          backgroundColor: 'transparent'
                         },
                        headerLeft: () => (
                            <LeftBackButton route="/profile" bg="black" />
                        ),
                    }}
                ></Stack.Screen>
                <Stack.Screen
                    name="plans"
                    options={{
                      title: "Pay Plans",
                       headerShadowVisible: false,
                       headerStyle: {
                        backgroundColor: 'transparent'
                       },
                      headerLeft: () => (
                          <LeftBackButton route="/profile" bg="black" />
                      ),
                  }}
                ></Stack.Screen>
            
                <Stack.Screen
                    name="preference"
                    options={{
                      title: "User Preference",
                       headerShadowVisible: false,
                       headerStyle: {
                        backgroundColor: 'transparent'
                       },
                      headerLeft: () => (
                          <LeftBackButton route="/profile/settings" bg="black" />
                      ),
                  }}
                ></Stack.Screen>
                <Stack.Screen
                    name="account"
                    options={{
                      title: "User Profile",
                       headerShadowVisible: false,
                       headerStyle: {
                        backgroundColor: 'transparent'
                       },
                      headerLeft: () => (
                          <LeftBackButton route="/profile/settings" bg="black" />
                      ),
                  }}
                ></Stack.Screen>
                <Stack.Screen
                    name="pref/fitnessGoal"
                    options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                    name="pref/fitnessLevel"
                    options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                    name="pref/existingInjury"
                    options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                    name="pref/dietPref"
                    options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                    name="pref/height"
                    options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                    name="pref/weight"
                    options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                    name="pref/foodDislike"
                    options={{ headerShown: false }}
                ></Stack.Screen>
            </Stack>
        </CustomSaveAreaView>
    )
}

export default LayoutView
