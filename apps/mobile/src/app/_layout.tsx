import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { config } from "@tamagui/config/v3";
import { createTamagui, TamaguiProvider, Theme } from "@tamagui/core";
import {
  ThemeProvider,
  DefaultTheme,
} from "@react-navigation/native"

import { UserProvider } from "../provider/user";
import { TRPCProvider } from "../utils/api";
import { supabase } from "../utils/supabase";
import { useColorScheme } from "react-native";
import { HealthKitProvider } from "~/integration/healthKit";

const tamaguiConfig = createTamagui(config);

export default function RootLayout() {
  const colorScheme = useColorScheme()
  
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <SessionContextProvider supabaseClient={supabase}>
        <TRPCProvider>
        <Theme name={colorScheme} >
                        <ThemeProvider
                            value={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: '#fff'}}}
                        >
        <StatusBar />
          <UserProvider>
      
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
            </Stack>
        
          </UserProvider>
          </ThemeProvider>
          </Theme>
        </TRPCProvider>
      </SessionContextProvider>
    </TamaguiProvider>
  );
}
