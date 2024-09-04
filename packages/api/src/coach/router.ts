import { createTRPCRouter } from "../trpc";
import { chatRouter } from "./chat/router";


export const coachRouter = createTRPCRouter({
    chat: chatRouter
})