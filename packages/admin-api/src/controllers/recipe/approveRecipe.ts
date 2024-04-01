import { TRPCError } from "@trpc/server";
import { RecipeByIdSchema } from "../../schema/recipe";
import { protectedProcedure } from "../../trpc";


const toggleApprovalRecipeController = protectedProcedure.input(RecipeByIdSchema).mutation(async ({ input, ctx }) => {
    const { id } = input;
    const { prisma } = ctx;

    

    // todo: In future to add access magnament to this api 


    const recipe = await prisma.recipe.findUnique({ where: { id }})
    if (!recipe){
        throw new TRPCError({ code: "NOT_FOUND"})
    }
    const  update = await prisma.recipe.update({
        where: {
            id
        },
        data: {
            isApproved: !recipe.isApproved 
        }
    })
    return update;
})

export { toggleApprovalRecipeController }