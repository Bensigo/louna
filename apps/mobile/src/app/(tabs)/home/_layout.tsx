import { Stack } from "expo-router";
import { HealthKitProvider } from "~/integration/healthKit";

const RootLayout = () => {
  return (

      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
      </Stack>
  
  );
};

export default RootLayout;