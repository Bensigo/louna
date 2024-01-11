import { GetFilesByBaseIdSchema } from "../../schema/upload"
import { publicProcedure } from "../../trpc"

export const getFilesByBaseIdsController = publicProcedure
    .input(GetFilesByBaseIdSchema)
    .mutation(async ({ ctx, input }) => {

        const files = await ctx.prisma.file.findMany({
            where: {
                baseId: input.id,
                isValid: true
            }
        });

        return files;
    })
