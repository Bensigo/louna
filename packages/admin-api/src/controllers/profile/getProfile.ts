import { z } from "zod";
import { protectedProcedure } from "../../trpc";


const getProfileController  = protectedProcedure.input(z.object({
   userId: z.string().optional(),

})).query(async ({ctx , input }) => {
    const { auth, prisma } = ctx;
  
    const profile = await prisma.user.findUnique({
       where: {
          id:  input.userId || auth.userId 
       },
    })
    return profile
  })
  
  
  export { getProfileController }