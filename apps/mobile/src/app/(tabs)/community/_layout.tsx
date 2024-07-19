import { Stack } from "expo-router"
import { CustomSaveAreaView } from "../../../components/CustomSaveAreaView"


const LayoutView = () => { 
    return (
    <CustomSaveAreaView>
        <Stack 
        
        >
            <Stack.Screen
             name="index"
             options={{
                headerShown: false
             }}
            >
                
            </Stack.Screen>
            <Stack.Screen
             name="createPost"
             options={{
                headerShown: false
             }}
            >
                
            </Stack.Screen>
        </Stack>
        </CustomSaveAreaView>
    )
}

export default LayoutView
