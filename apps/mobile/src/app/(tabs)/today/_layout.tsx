import { Stack } from "expo-router"

import { CustomSaveAreaView } from "../../../components/CustomSaveAreaView"
import { LeftBackButton } from "../../_layout"

const LayoutView = () => {
    return (
        <CustomSaveAreaView>
            <Stack>
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
                            <LeftBackButton route="/today" bg="black" />
                        ),
                    }}
                ></Stack.Screen>
            </Stack>
        </CustomSaveAreaView>
    )
}

export default LayoutView
