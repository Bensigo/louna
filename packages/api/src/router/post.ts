import { createCommentController } from "../controllers/post/createComment";
import { createPostController } from "../controllers/post/createPost";
import { getPostController } from "../controllers/post/getPost";
import { likePostController } from "../controllers/post/likePost";
import { listCommentController } from "../controllers/post/listComments";
import { listPostController } from "../controllers/post/listPost";
import { createTRPCRouter } from "../trpc";


export const postRouter = createTRPCRouter({
    createPost: createPostController,
    getPost: getPostController,
    listPost: listPostController,
    likePost: likePostController,
    createComment: createCommentController,
    listComment: listCommentController
})