
import { Stack } from "expo-router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { getData } from "~/utils/healthkit";

const RootLayout = () => {
   const { mutate } = api.log.syncHealthData.useMutation()

  useEffect(() => {
    let isMounted = true;
    const fetchHealthData = async () => {
      if (!isMounted) return;
      try {
        const healthData = await getData();
        mutate(healthData);
      } catch (error) {
        console.error('Error fetching health data:', error);
      }
    };

    void fetchHealthData();

    return () => {
      isMounted = false;
    };
  }, [mutate]);
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
