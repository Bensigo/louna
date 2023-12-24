import { addPreferenceSchema } from "../../schemas/preference"
import { protectedProcedure } from "../../trpc"

const addPrefrenceController = protectedProcedure
    .input(addPreferenceSchema)
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.auth.userId;
        const { type, config }  = input;

        const preference = await ctx.prisma.preference.create({
            data: {
                userId,
                type,
                config,
            }
        })

        return preference;
    })

export { addPrefrenceController }    
