import { Stack } from "expo-router"

import { CustomSaveAreaView } from "../../../components/CustomSaveAreaView"
import { LeftBackButton } from "../../../app/_layout"

const LayoutView = () => {
    return (
        <CustomSaveAreaView>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{ headerShown: false }}
                ></Stack.Screen>
                  <Stack.Screen
                    name="list/index"
                   options={{
                    headerShown: false,
                  
                   }}
                ></Stack.Screen>
                  <Stack.Screen
                    name="list/[id]/index"
                    options={{ headerShown: false }}
                   
                ></Stack.Screen>
                 <Stack.Screen
                    name="list/[id]/sessions"
                    options={{
                        title: "sessions",
                         headerShadowVisible: false,
                         headerStyle: {
                          backgroundColor: 'transparent'
                         },
                        headerLeft: () => (
                            <LeftBackButton bg="black" />
                        ),
                    }}
                ></Stack.Screen>
                  <Stack.Screen
                    name="upcoming/index"
                    options={{
                        title: "upcoming",
                        headerShadowVisible: false,
                        headerStyle: {
                         backgroundColor: 'transparent'
                        },
                       headerLeft: () => (
                           <LeftBackButton  bg="black" />
                       ),
                    }}
                ></Stack.Screen>
                    <Stack.Screen
                    name="upcoming/[id]"
                    options={{ headerShown: false }}
                ></Stack.Screen>
            </Stack>
        </CustomSaveAreaView>
    )
}

export default LayoutView
