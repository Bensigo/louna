import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

import "react-native-url-polyfill/auto";

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

if (
  !process.env.EXPO_PUBLIC_SUPABASE_URL ||
  !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
) {
  throw new Error(
    "Please provide SUPABASE_URL and SUPABASE_ANON_KEY in your .env file",
  );
}
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supaBaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log({ supabaseUrl, supaBaseAnonKey });
export const supabase = createClient(supabaseUrl, supaBaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    // debug: true,
  },
});
