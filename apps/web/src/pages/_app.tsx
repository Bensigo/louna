import { type AppProps } from "next/app"

// import { appWithTranslation } from "next-i18next"

import { api } from "~/utils/api"


function App({ Component, pageProps }: AppProps) {
    // 2. Wrap NextUIProvider at the root of your app
    return (  <>
          <Component  {...pageProps} />
        </>
            
            


    )
}

export default api.withTRPC(App)
