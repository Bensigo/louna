import { getProfileController } from "../controllers/profile/getProfile"
import { createTRPCRouter } from "../trpc"




const profileRouters = createTRPCRouter({
    get: getProfileController,
})


export { profileRouters }