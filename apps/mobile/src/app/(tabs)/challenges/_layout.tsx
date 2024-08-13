import { Plus } from "@tamagui/lucide-icons";
import { router, Stack } from "expo-router";
import {  Button, H1, View } from "tamagui";

import { HeaderBackButton } from "~/components/header";
import { colorScheme } from "~/constants/colors";




const RootLayout = () => {
  const gotoCreate =() => router.push('/challenges/create')
  return (
    <View flex={1}>
     <View paddingHorizontal={10}>
     <H1 fontSize={25} fontWeight={'bold'} color={colorScheme.text.primary}>Challenges</H1>
     </View>
      <Stack >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="create"
          options={{
            headerShown: false,
            presentation: "formSheet",
            headerLeft: () => <HeaderBackButton />,
          }}
        ></Stack.Screen>
        <Stack.Screen
            name="[id]"
            options={{
              title: '',
              headerTransparent: true,
              presentation: "formSheet",
              headerLeft: () => <HeaderBackButton />,
            }}
        ></Stack.Screen>
      </Stack>
      <Button elevation={5} zIndex={1000} onPress={gotoCreate} position="absolute"  backgroundColor={colorScheme.primary.green} size={45} icon={<Plus size={20} color={colorScheme.primary.white}/>} bottom={35} right={20}/>
    </View>

  );
};

export default RootLayout;
