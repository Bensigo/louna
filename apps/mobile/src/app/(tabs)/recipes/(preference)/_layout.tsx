import { Progress } from "tamagui";
import { LeftBackButton } from "../../../../app/_layout";
import { RecipePrefProvider } from "../../../../context/receipePref";
import { Stack, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";



const LayoutView = () => {
    const insets = useSafeAreaInsets();
    const path = usePathname()
    
    const getProgress = (() => {
        if (path === '/recipes/stepOne'){
            return 25
        }  else if(path === '/recipes/stepTwo'){
            return 50
        }else if (path === '/recipes/stepThree'){
            return 75
        }else {
            return 100
        }
    })()

   
    return (
        <RecipePrefProvider>
            <Stack initialRouteName="stepOne">
                
                <Stack.Screen 
                    name="stepOne"
                    options={{
                         title: '',
                         headerTransparent: true,
                         headerLeft: () => <LeftBackButton  route='/community' />
                        
                         
                    }}
                ></Stack.Screen>
                
                  <Stack.Screen 
                    name="stepTwo"
                    options={{ 
                        title: '',
                        headerTransparent: true,
                        headerLeft: () => <LeftBackButton  route='/recipes/stepOne' />
                     }}
                ></Stack.Screen>
                   <Stack.Screen 
                    name="stepThree"
                    options={{ 
                        title: '',
                        headerTransparent: true,
                        headerLeft: () => <LeftBackButton  route='/recipes/stepTwo' />
                     }}
                ></Stack.Screen>
                 <Stack.Screen 
                    name="stepFour"
                    options={{ 
                        title: '',
                        headerTransparent: true,
                        headerLeft: () => <LeftBackButton  route='/recipes/stepTwo' />
                     }}
                ></Stack.Screen>
             
            </Stack>
          
            <Progress top={insets.top + 15} position="absolute" marginVertical={10} borderRadius={0} size={"$2"} value={getProgress}>
                <Progress.Indicator backgroundColor={'$green7'}  animation="bouncy" />
            </Progress>
        </RecipePrefProvider>
    )
}
export default LayoutView;