import { type IncomingHttpHeaders } from "http"
import type { NextApiRequest, NextApiResponse } from "next"
import { buffer } from "micro"
import { Webhook, type WebhookRequiredHeaders } from "svix"

import { prisma } from "@solu/db"

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
    headers: IncomingHttpHeaders & WebhookRequiredHeaders
}
const webhookSecret: string = process.env.STRAPI_WEBHOOK_SECRET || "123456789"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const { body: payload, headers } = req
    console.log({ headers, payload })
    if (headers["x-secrect"] != webhookSecret) {
        res.status(401).send({})
        return
    }

    // check if event triggered is entry.published with cmmunuty model
    const event = "entry.publish"
    const model = "community"
    const { entry } = payload
    const data = {
        name: entry.name,
        city: (entry.city as string).toLowerCase(),
        country: (entry.country as string).toLowerCase(),
        minPoint: Number(entry.minPoint),
    }
    if (payload.event === event && payload.model === model) {
        // create a new cmmunity
        const newCommunity = await prisma.community.create({
            data: {
                ...data,
            },
        })
        console.log({ newCommunity })
        return
    }
    // todo : think about adding on delete
    res.json({})
}
