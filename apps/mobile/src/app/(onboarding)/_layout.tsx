import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OnboardingLayout = () => {
  return (
    <SafeAreaView
    style={{ flex: 1, paddingTop: StatusBar.currentHeight }}
    edges={["top", "left", "right"]}
  >
      <Stack
      initialRouteName="index"
        screenOptions={{
            headerShown: false,
            presentation: "formSheet",
        }}
      >
        <Stack.Screen name="index" options={{ title: "Username" }} />
      </Stack>
</SafeAreaView>
  );
};

export default OnboardingLayout;
