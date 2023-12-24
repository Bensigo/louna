import { protectedProcedure } from "../../trpc";


const getProfileController  = protectedProcedure.query(async ({ctx }) => {
    const { auth, prisma } = ctx;
  
    const profile = await prisma.user.findUnique({
       where: {
          id: auth.userId
       },
    })
    return profile
  })
  
  
  export { getProfileController }