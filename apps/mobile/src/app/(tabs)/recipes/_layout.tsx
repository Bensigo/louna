import { useRouter, Stack, useRootNavigation } from "expo-router"
import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { useEffect } from "react";
import { CustomSaveAreaView } from "../../../components/CustomSaveAreaView"

export const RECIPE_PREFRENCE_KEY = 'isRecipePreference'
const LayoutView = () => {
    const rootNav = useRootNavigation()

    const router = useRouter();
    const { getItem:  haveRecipePreference } = useAsyncStorage(RECIPE_PREFRENCE_KEY)



    useEffect(() => {
        console.log("========= called =======")
        router.replace('recipes/(preference)')
        const isPreferenceSet = async () => await haveRecipePreference();
        console.log({ isPreferenceSet })
        if(rootNav?.isReady()) {
            isPreferenceSet().then(val => {
                console.log({ tttt: val })
                if (val === null || val === undefined){
                    router.replace('recipes/(preference)')
                }
            })
        }
       
      
     
    }, []);

    return (
        <CustomSaveAreaView>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{ headerShown: false }}
                ></Stack.Screen>
                <Stack.Screen
                    name="(preference)"
                    options={{ headerShown: false }}
                ></Stack.Screen>
                  <Stack.Screen
                    name="[id]"
                    options={{ headerShown:false   }}
                ></Stack.Screen>
            </Stack>
        </CustomSaveAreaView>
    )
}

export default LayoutView
