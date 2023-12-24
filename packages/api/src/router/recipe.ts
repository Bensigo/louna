import { bookmarkRecipeController } from "../controllers/recipe/bookmarkRecipe";
import { getRecipeController } from "../controllers/recipe/getRecipe";
import { likeRecipeController } from "../controllers/recipe/likeRecipe";
import { listBookmarkController } from "../controllers/recipe/listBookmarks";
import { listRecipeController } from "../controllers/recipe/listRecipe";
import { createTRPCRouter } from "../trpc";





export const recipeRouters = createTRPCRouter({
    likeRecipe: likeRecipeController,
    getRecipe: getRecipeController,
    list: listRecipeController,
    bookmark: bookmarkRecipeController,
    listBookmark: listBookmarkController 
})





