import { z } from "zod";


export const createPostSchema = z.object({
    text: z.string().optional(),
})

export const getPostSchema = z.object({
    id: z.string()
})


export const listPostSchema = z.object({
    skip: z.number().optional().default(0),
    limit: z.number().optional().default(100),
})


export const likePostSchema = z.object({
  postId: z.string()
})


export const createCommentSchema = z.object({
    postId: z.string(),
    comment: z.string() 
})

export const listCommentSchema = z.object({
    skip: z.number().optional().default(0),
    postId: z.string(),
    limit: z.number().optional().default(100),
})