import { z } from "zod";


export const ListBookingSchema = z.object({
    limit: z.number().default(20),
    page: z.number().default(1),
})