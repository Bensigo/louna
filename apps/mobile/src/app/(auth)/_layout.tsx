import {  Stack } from "expo-router";
import { View } from "tamagui";

// import { useSession } from "@supabase/auth-helpers-react";

import { HeaderBackButton } from "~/components/header";

const Auth = () => {
  return (
    <View flex={1} paddingHorizontal={15}>
      <Stack
        initialRouteName="verify"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            headerTitle: "",
            headerShown: false,
            headerTransparent: true,
            headerLeft: () => <HeaderBackButton />,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerTitle: "",
            headerTransparent: true,
            headerLeft: () => <HeaderBackButton />,
          }}
        />
        <Stack.Screen
          name="verify"
          options={{
            headerTitle: "",
            headerTransparent: true,
            headerLeft: () => <HeaderBackButton />,
          }}
        />
      </Stack>
    </View>
  );
};

export default Auth;
