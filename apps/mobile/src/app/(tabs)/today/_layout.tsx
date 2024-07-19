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
                    name="resources/index"
                    options={{
                        title: "Resources",
                        headerShadowVisible: false,
                       headerStyle: {
                        backgroundColor: 'transparent',
                       },
                        headerLeft: () => (
                            <LeftBackButton route="/today" bg="black" />
                        ),
                    }}
                ></Stack.Screen>
                   <Stack.Screen
                    name="resources/[id]/index"
                    options={{
                        title: "Resource",
                        headerShadowVisible: false,
                       headerStyle: {
                        backgroundColor: 'transparent',
                       },
                        headerLeft: () => (
                            <LeftBackButton route="/today" bg="black" />
                        ),
                    }}
                ></Stack.Screen>
                <Stack.Screen
                      name="activities/[category]"
                      options={{
                          title: "Activities",
                          headerShadowVisible: false,
                         headerStyle: {
                          backgroundColor: 'transparent',
                         },
                          headerLeft: () => (
                              <LeftBackButton route="/today" bg="black" />
                          ),
                      }}
                ></Stack.Screen>
                
                <Stack.Screen
                      name="goals/steps"
                      options={{
                          title: "Steps",
                          headerShadowVisible: false,
                         headerStyle: {
                          backgroundColor: 'transparent',
                         },
                          headerLeft: () => (
                              <LeftBackButton route="/today" bg="black" />
                          ),
                      }}
                ></Stack.Screen>  
                <Stack.Screen
                      name="goals/flexibility"
                      options={{
                          title: "Flexibility",
                          headerShadowVisible: false,
                         headerStyle: {
                          backgroundColor: 'transparent',
                         },
                          headerLeft: () => (
                              <LeftBackButton route="/today" bg="black" />
                          ),
                      }}
                ></Stack.Screen>  
                 <Stack.Screen
                      name="goals/breathing"
                      options={{
                          title: "Breathing Exercise",
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
