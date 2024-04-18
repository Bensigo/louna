import { type AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import {
    ClerkProvider,
} from "@clerk/nextjs"
import { appWithTranslation } from "next-i18next"

import { api } from "~/utils/api"

function MyApp({ pageProps, Component }: AppProps) {
    return (
        <ClerkProvider {...pageProps}>
            <ChakraProvider>
                    <Component {...pageProps} />   
            </ChakraProvider>
        </ClerkProvider>
    )
}

export default api.withTRPC(appWithTranslation(MyApp))
