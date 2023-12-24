import { addPrefrenceController } from "../controllers/preference/addPreference";
import { getUserPreferenceController } from "../controllers/preference/getUserPreference";
import { createTRPCRouter } from "../trpc";


const preferenceRouter = createTRPCRouter({
    createPreference: addPrefrenceController,
    getUserPreference: getUserPreferenceController
})

export { preferenceRouter }