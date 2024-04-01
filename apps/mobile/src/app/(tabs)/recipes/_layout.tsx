import { useRouter, Stack, useRootNavigation } from "expo-router"


import { CustomSaveAreaView } from "../../../components/CustomSaveAreaView"
import { LeftBackButton } from "../../../app/_layout";

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
                        headerTitle: "Bookmarks",
                        headerTransparent: true,
                        headerLeft: () => <LeftBackButton  route='/recipes' />,
                    }}
                ></Stack.Screen>
            </Stack>
        </CustomSaveAreaView>
    )
}

export default LayoutView
