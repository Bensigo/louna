import { Stack } from "expo-router"
import { CustomSaveAreaView } from "../CustomSaveAreaView"
import { LeftBackButton } from "../../app/_layout"


const LayoutView = () => {
    return (
        <CustomSaveAreaView>
        <Stack >
            <Stack.Screen
                name="index"
                options={{ headerShown: false }}
            ></Stack.Screen>
            <Stack.Screen
                    name="name/index"
                    options={{
                        title: "",
                         headerShadowVisible: false,
                         headerStyle: {
                          backgroundColor: 'transparent'
                         },
                        headerLeft: () => (
                            <LeftBackButton route="/workout" bg="black" />
                        ),
                    }}
                   
                ></Stack.Screen>
                 <Stack.Screen
                    name="name/[id]/index"
                    options={{
                        title: "",
                         headerShadowVisible: false,
                         headerStyle: {
                          backgroundColor: 'transparent'
                         },
                        headerLeft: () => (
                            <LeftBackButton  bg="black" />
                        ),
                    }}
                   
                ></Stack.Screen>
            </Stack>
            </CustomSaveAreaView>
    )
}


export default LayoutView