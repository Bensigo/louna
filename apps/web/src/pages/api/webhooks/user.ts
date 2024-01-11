import { type IncomingHttpHeaders } from "http"
import type { NextApiRequest, NextApiResponse } from "next"
import { type WebhookEvent } from "@clerk/clerk-sdk-node"
import { buffer } from "micro"
import { Webhook, type WebhookRequiredHeaders } from "svix"

import { type UserRole, prisma } from "@solu/db"

// Disable the bodyParser so we can access the raw
// request body for verification.
export const config = {
    api: {
        bodyParser: false,
    },
}

const webhookSecret: string = process.env.WEBHOOK_SECRET || ""

export default async function handler(
    req: NextApiRequestWithSvixRequiredHeaders,
    res: NextApiResponse,
) {
    // Verify the webhook signature
    // See https://docs.svix.com/receiving/verifying-payloads/how
    const payload = (await buffer(req)).toString()
    const headers = req.headers
    const wh = new Webhook(webhookSecret)

    let evt: WebhookEvent | null = null
    try {
        evt = wh.verify(payload, headers) as WebhookEvent
    } catch (_) {
        return res.status(400).json({
            error: "Invalid webhook signature",
        })
    }

    // Handle the webhook
    const eventType = evt.type
    if (eventType === "user.created") {
        const { id, email_addresses, first_name, last_name, image_url, unsafe_metadata } = evt.data

        const [emailAdressObject] = email_addresses

        if (
            !emailAdressObject ||
            emailAdressObject.email_address === undefined
        ) {
            return res.status(400).json({
                error: "No email address",
            })
        }1
        let metadata = {}
        if (unsafe_metadata.role === "INSTRUCTOR"){
            metadata = {
                isApproved: false         
            }
        }

        const user = await prisma.user.create({
            data: {
                id,
                email: emailAdressObject.email_address,
                firstname: first_name || null,
                lastname: last_name || null,
                imageUrl: image_url || '',
                roles: [(unsafe_metadata.role as UserRole)],
                metadata: {
                    ...(metadata),
                    signupAgent:  unsafe_metadata.agent,
                } as any
            },
        })
        if (unsafe_metadata.role !== 'ADMIN'){
            await prisma.wallet.create({
                data: {
                    userId: user.id,
                },
            })
        }
   
        console.log("user created sucessfull")
    }

    res.json({})
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
    headers: IncomingHttpHeaders & WebhookRequiredHeaders
}
