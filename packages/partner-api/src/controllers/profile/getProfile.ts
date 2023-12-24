import { protectedProcedure } from "../../trpc";



const getProfileController  = protectedProcedure.query(async ({ctx }) => {
  const { auth, prisma } = ctx;

  const profile = await prisma.user.findUnique({
     where: {
        id: auth.userId
     },
     include: {
        partnerProfile: true,
        wallet: true,
     }
  })
  return profile
})


export { getProfileController }