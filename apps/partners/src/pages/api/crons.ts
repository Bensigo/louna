import { type NextApiRequest, type NextApiResponse } from "next"

import { cronManager } from "@solu/api"

import { env } from "~/env.mjs"

export const dynamic = "force-dynamic"

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
    const cronName = req.query.command as string

    const secret = req.headers["x-secret"]
    if (!secret || !cronName) {
        return res.status(400).send("Invalid cron")
    }

    // validate secret
    if (secret !== env.X_SECRET) {
        return res.status(401).send("Unauthorized")
    }

    await cronManager(req.query)
    return res.status(200)
}
