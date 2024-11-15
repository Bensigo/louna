import {  useState } from "react";
import Constants from "expo-constants";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import {
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { createTRPCClient, httpBatchStreamLink } from '@trpc/client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCProxyClient, httpBatchLink, splitLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

import type { AppRouter } from "@lumi/api";
import { supabase } from "./supabase";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();
// The issue here is that the AppRouter type from @lumi/api doesn't seem to match
// the expected Router type for createTRPCReact. This could be due to a mismatch
// between the tRPC versions used in the mobile app and the API, or an incorrect
// export of the AppRouter type. To fix this, we need to ensure that:
// 1. The tRPC versions are consistent across the project
// 2. The AppRouter type is correctly exported from @lumi/api
// 3. If needed, we might need to adjust the type definition or use a more specific type

// For now, we can use a type assertion to bypass the type error, but this should be
// investigated and fixed properly in the future:
export { type RouterInputs, type RouterOutputs } from "@lumi/api";

const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];
  if (!localhost) {
    return process.env.EXPO_PUBLIC_API_URL
  }
  // return `http://${localhost}:3000`;
  return `http://${localhost}:3000`;
};

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
export const TRPCProvider = (props: { children: React.ReactNode }) => {
  const supabase = useSupabaseClient();
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => 
    api.createClient({
      transformer: superjson,
      links: [
         httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
            async headers(header) {
              const { data } = await supabase.auth.getSession();
              const token = data.session?.access_token;
              return {
                 Authorization: `Bearer ${token}`,
                'x-trpc-source': 'expo-react',
                "app-token": token,
           
              };
            },
          })
        
        // httpBatchLink({
        //   url: `${getBaseUrl()}/api/trpc`,
        //   async headers(header) {
        //     const { data } = await supabase.auth.getSession();
        //     const token = data.session?.access_token;
        //     return {
        //        Authorization: `Bearer ${token}`,
        //       'x-trpc-source': 'expo-react',
        //       "app-token": token,
         
        //     };
        //   },
        // })
      ]
    })
  );

  useReactQueryDevTools(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
};


export const appApi = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
   links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        async headers(header) {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          return {
             Authorization: `Bearer ${token}`,
            'x-trpc-source': 'expo-react',
            "app-token": token,
       
          };
        },
      })
    ]
})


export const trpc = createTRPCProxyClient<AppRouter>({
    transformer: superjson,
   links: [
    unstable_httpBatchStreamLink({
      url: `${getBaseUrl()}/api/trpc`,
      textDecoder: new TextDecoder(),
      async headers(header) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        return {
           Authorization: `Bearer ${token}`,
          'x-trpc-source': 'expo-react',
          "app-token": token,
     
        };
      },
    })
   ]
})
