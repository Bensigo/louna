
import { Stack } from "expo-router";
import { HealthKitProvider } from "~/utils/healthKit2";

const RootLayout = () => {
  return (
    // <HealthKitProvider>
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      ></Stack.Screen>
    </Stack>
    // </HealthKitProvider>
  );
};

export default RootLayout;
