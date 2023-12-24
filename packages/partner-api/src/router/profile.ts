import { createProfileController } from "../controllers/profile/createProfile"
import { getProfileController } from "../controllers/profile/getProfile"
import { createTRPCRouter } from "../trpc"



const profileRouters = createTRPCRouter({
    get: getProfileController,
    create: createProfileController
})


export { profileRouters }