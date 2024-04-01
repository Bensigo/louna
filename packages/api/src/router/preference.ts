import { updatePrefController } from "../controllers/preference/update";
import { upsertUserPrefrenceController } from "../controllers/preference/upsert";
import { createTRPCRouter } from "../trpc";


const preferenceRouter = createTRPCRouter({
    update: updatePrefController,
    upsert: upsertUserPrefrenceController
})

export { preferenceRouter }