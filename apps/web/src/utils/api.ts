import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";

import type { AppRouter  } from "@lumi/api";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  console.log({ vercel_url: process.env.VERCEL_URL})
  if (process.env.VERCEL_URL) return `${process.env.VERCEL_URL}`; // SSR should use vercel url
  
  return `http://localhost:3000`; 

};

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      abortOnUnmount: true,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry(failureCount, error) {
              console.log("retrying due to", error, failureCount)
            },
          }
        }
      },
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  
  ssr: false,
});

export { type RouterInputs, type RouterOutputs } from "@lumi/api";
