import { z } from "zod";


export const addPreferenceSchema  = z.object({
    type: z.enum(["RECIPE", "BOOKING",  "FITNESS"]),
    config: z.record(z.any())
}) 