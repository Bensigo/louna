import { toggleApprovalRecipeController } from "../controllers/recipe/approveRecipe";
import { createRecipeController } from "../controllers/recipe/createRecipe";
import { deleteRecipeController } from "../controllers/recipe/delete";
import { getRecipeController } from "../controllers/recipe/getRecipe";
import { listRecipeController } from "../controllers/recipe/listRecipeController";
import { updateRecipeController } from "../controllers/recipe/updateRecipe";
import { createTRPCRouter } from "../trpc";


export const recipeRouter = createTRPCRouter({
    create: createRecipeController,
    get: getRecipeController,
    list: listRecipeController,
    toggleApproval: toggleApprovalRecipeController,
    update: updateRecipeController,
    delete: deleteRecipeController
})