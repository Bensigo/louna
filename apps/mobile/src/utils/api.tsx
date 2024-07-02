import React, { useMemo } from "react"
import { useAuth } from "@clerk/clerk-expo"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {  httpBatchLink  } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import superjson from "superjson"

import { type AppRouter } from "@solu/api"




/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>()
export { type RouterInputs, type RouterOutputs } from "@solu/api"


/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */

export const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    // const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://solu-web.vercel.app/'
    const API_URL = "https://solu-web.vercel.app"
    // const API_URL = "http://localhost:7001"

    console.log({ API_URL })

    const { getToken } = useAuth()
    const queryClient = useMemo(() => new QueryClient(), [])
    const trpcClient = useMemo(
        () =>
            api.createClient({
                transformer: superjson,
                links: [
                    httpBatchLink({
                        async headers() {
                            const headers = new Map<string, string>();
                            headers.set("x-trpc-source", "expo-react");
                            const authToken = await getToken()
                            if (authToken) headers.set("authorization", `Bearer ${authToken}`);

                            return Object.fromEntries(headers);
                        },
                        url: `${API_URL}/api/trpc`,
                    }),
                ],
            }),
        [getToken, API_URL]
    )

    return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </api.Provider>
    )
}
