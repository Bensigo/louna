import { z } from "zod";
import { ListSchemaBase } from "./common/base";


export const ListPartnerSchema = ListSchemaBase.extend({
    filter: z.object({
        category: z.string(),
        date: z.date(),
    })
})