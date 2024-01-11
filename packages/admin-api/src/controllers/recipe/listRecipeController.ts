import { ListRecipeSchema } from "../../schema/recipe";
import { protectedProcedure } from "../../trpc";



export const listRecipeController = protectedProcedure.input(ListRecipeSchema).query(async ({ ctx, input }) => {
    // hello write code here 
})