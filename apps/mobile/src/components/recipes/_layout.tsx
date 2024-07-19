import { useRouter, Stack, useRootNavigation } from "expo-router"


import { CustomSaveAreaView } from "../CustomSaveAreaView"
import { LeftBackButton } from "../../app/_layout";

export const RECIPE_PREFRENCE_KEY = 'isRecipePreference'
const LayoutView = () => {
 

    return (
        <CustomSaveAreaView>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{ headerShown: false }}
                ></Stack.Screen>
                  <Stack.Screen
                    name="[id]"
                    options={{ headerShown: false }}
                   
                ></Stack.Screen>
                 <Stack.Screen
                    name="bookmarks"
                   
               

                    options={{
                        title: "Bookmarks",
                         headerShadowVisible: false,
                         headerStyle: {
                          backgroundColor: 'transparent'
                         },
                        headerLeft: () => (
                            <LeftBackButton route="/recipes" bg="black" />
                        ),
                    }}
                ></Stack.Screen>
            </Stack>
        </CustomSaveAreaView>
    )
}

export default LayoutView
