import { bookmarkRecipeController } from "../controllers/recipe/bookmarkRecipe";
import { getRecipeController } from "../controllers/recipe/getRecipe";
import { isBookmarkController } from "../controllers/recipe/isBookmark";
import { isLikeController } from "../controllers/recipe/isLike";
import { likeRecipeController } from "../controllers/recipe/likeRecipe";
import { listBookmarkController } from "../controllers/recipe/listBookmarks";
import { listRecipeController } from "../controllers/recipe/listRecipe";
import { createTRPCRouter } from "../trpc";





export const recipeRouters = createTRPCRouter({
    likeRecipe: likeRecipeController,
    getRecipe: getRecipeController,
    list: listRecipeController,
    bookmarkRecipe: bookmarkRecipeController,
    isLike: isLikeController,
    listBookmark: listBookmarkController,
    isBookmark: isBookmarkController
})





