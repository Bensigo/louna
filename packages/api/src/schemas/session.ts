import { z } from "zod";
import { ListSchemaBase } from "./common/base";



export const ListSessionSchema = ListSchemaBase.extend({
    filter: z.object({
        category: z.string(),
        date: z.string().optional(),
    })
})
