import { Stack } from "expo-router"


const LayoutView = () => { 
    return (
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
    )
}

export default LayoutView
