import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { config } from "@tamagui/config/v3";
import { createTamagui, TamaguiProvider } from "@tamagui/core";

import { UserProvider } from "../provider/user";
import { TRPCProvider } from "../utils/api";
import { supabase } from "../utils/supabase";

const tamaguiConfig = createTamagui(config);

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <SessionContextProvider supabaseClient={supabase}>
        <TRPCProvider>
        <StatusBar />
          <UserProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            </Stack>
           
          </UserProvider>
        </TRPCProvider>
      </SessionContextProvider>
    </TamaguiProvider>
  );
}
