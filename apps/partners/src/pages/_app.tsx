import { type AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import { ClerkProvider } from "@clerk/nextjs"
import { appWithTranslation } from "next-i18next"

import { api } from "~/utils/api"
import { AuthProvider } from "~/context/authContext"

function App({ Component, pageProps }: AppProps) {
    // 2. Wrap NextUIProvider at the root of your app
    return (
        <ClerkProvider>
            <ChakraProvider>
                <AuthProvider >
                     <Component  {...pageProps} />
                </AuthProvider>  
            </ChakraProvider>
        </ClerkProvider>
    )
}

export default api.withTRPC(appWithTranslation(App))
