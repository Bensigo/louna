import { Stack } from "expo-router";
import { H1, View } from "tamagui";
import { colorScheme } from "~/constants/colors";
import { HealthKitProvider } from "~/integration/healthKit";

const RootLayout = () => {
  return (
    <HealthKitProvider>
   <View paddingHorizontal={10} flex={1}>
       <H1 fontSize={30} fontWeight={'bold'} color={colorScheme.text.primary}>Louna</H1>
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="[name]"
        options={{ headerShown: false, presentation: "formSheet" }}
      />
    </Stack>
   </View>
   </HealthKitProvider>
  )
};

export default RootLayout;