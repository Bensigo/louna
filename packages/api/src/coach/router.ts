import { createTRPCRouter } from "../trpc";
import { chatController } from "./chat/controller";


export const coachRouter = createTRPCRouter({
    chat: chatController
})