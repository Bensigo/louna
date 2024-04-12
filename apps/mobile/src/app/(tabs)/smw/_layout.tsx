import { Stack } from "expo-router"
import { CustomSaveAreaView } from "../../../components/CustomSaveAreaView"
import { LeftBackButton } from "../../../app/_layout"


const LayoutView = () => {
    return (
        <CustomSaveAreaView>
        <Stack >
            <Stack.Screen
                name="index"
                options={{ headerShown: false }}
            ></Stack.Screen>
                 <Stack.Screen
                    name="[id]"
                    options={{
                        title: "",
                         headerShadowVisible: false,
                         headerStyle: {
                          backgroundColor: 'transparent'
                         },
                        headerLeft: () => (
                            <LeftBackButton route="/smw" bg="black" />
                        ),
                    }}
                   
                ></Stack.Screen>
            </Stack>
            </CustomSaveAreaView>
    )
}


export default LayoutView