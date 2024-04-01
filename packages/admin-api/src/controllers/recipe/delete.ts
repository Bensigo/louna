import { ById } from "../../schema/shared";
import { protectedProcedure } from "../../trpc";


export const deleteRecipeController = protectedProcedure.input(ById).mutation(async ({input, ctx }) => {
    const { prisma } = ctx;
    const {id } = input;

    const deleted = await prisma.recipe.update({
        where: {
            id
        },
        data: {
            deleted: true
        }
    })

    return !!deleted
})