import { z } from "zod";
import { ListSchemaBase } from "./common/base";


export const ListPartnerSchema = ListSchemaBase.extend({
    filter: z.object({
        categories: z.array(z.enum(['Fitness', 'Wellness'])).optional(),
        subCategories: z.array(z.string()).optional(),
        date: z.date().optional(),
    })
})