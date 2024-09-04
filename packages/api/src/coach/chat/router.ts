import { createTRPCRouter } from "../../trpc";
import { chatController } from "./controller";


export const chatRouter = createTRPCRouter({
    chat: chatController
})