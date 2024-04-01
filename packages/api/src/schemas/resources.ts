import { z } from "zod";


export const ListResourcesSchema = z.object({
    filter: z.object({
            limit: z.number().default(20),
            page: z.number().default(1),
     
            
    })
})