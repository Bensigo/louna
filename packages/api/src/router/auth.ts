import {
    getProfile,
    getProfilePictureUploadUrl,
    getProfilePictureUrl,
    updateProfile,
} from "../controllers/auth"
import { createTRPCRouter, publicProcedure } from "../trpc"

export const authRouter = createTRPCRouter({
    getSession: publicProcedure.query(({ ctx }) => {
        return !ctx.auth.session
    }),
    getProfile,
    updateProfile,
    getProfilePictureUploadUrl,
    getProfilePictureUrl,
})
