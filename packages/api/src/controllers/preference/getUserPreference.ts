import { protectedProcedure } from "../../trpc"

const getUserPreferenceController = protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId;

    const preferences = await ctx.prisma.preference.findMany({
        where: {
            userId
        }
    })
   console.log({ preferences })
    return preferences;
})

export { getUserPreferenceController }