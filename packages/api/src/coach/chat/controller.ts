import { protectedProcedure } from "../../trpc";


export const chatController = protectedProcedure.query(async function* ({ ctx, input }) {
    const testMessage = "Hello from the backend! This is a test stream.";
    for (let i = 0; i < testMessage.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        console.log({ msg: testMessage[i] })
        yield { message: testMessage[i] };
    }
    
    yield { message: "\n\nStream completed." };
})