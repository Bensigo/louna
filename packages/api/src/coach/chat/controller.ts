import { protectedProcedure } from "../../trpc";


export const chatController = protectedProcedure.query( async function* ({ ctx, input }) {
    for (let i = 0; i < 7; i++){
        await new Promise((resolve) => setTimeout(resolve, 500))
        yield i
    }
})