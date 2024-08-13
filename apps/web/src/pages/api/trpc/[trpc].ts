import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import Cors from "cors";

import { appRouter, createTRPCContext } from "@lumi/api";

// Initialize CORS middleware
const cors = Cors({
  methods: ["GET", "POST", "OPTIONS"],
});

// Helper function to run middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise<void>((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve();
    });
  });
}

// Middleware wrapper for CORS
export function withCors(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);
    return handler(req, res);
  };
}

// Create TRPC handler
const trpcHandler = createNextApiHandler({
  router: appRouter,
  createContext: async ({ req, res }) => {
    const supabase = createPagesServerClient({ req, res });
    const context = createTRPCContext({ req, res, supabase });
    return context;
  }
});

// Export API route handler with CORS
const handler: NextApiHandler = async (req, res) => {
  return withCors(trpcHandler)(req, res);
};

export default handler;
