import React from "react"
import Constants from "expo-constants"
import { useAuth } from "@clerk/clerk-expo"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink, httpLink } from "@trpc/client"
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
    const API_URL = process.env.EXPO_PUBLIC_API_URL
    const { getToken } = useAuth()
    const [queryClient] = React.useState(() => new QueryClient())
    const [trpcClient] = React.useState(() =>
        api.createClient({
            transformer: superjson,
            links: [
                httpLink({
                    async headers() {
                        const authToken = await getToken()
                        return {
                            Authorization: authToken ?? undefined,
                        }
                    },
                    url: `${API_URL}/api/trpc`,
                }),
            ],
        }),
    )

    return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </api.Provider>
    )
}
