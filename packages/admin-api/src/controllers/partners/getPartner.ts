import { ById } from "../../schema/partners";
import { protectedProcedure } from "../../trpc";



const getPartnerController = protectedProcedure.input(ById).query(async ({ ctx, input }) => {
    const prisma = ctx.prisma;

    const profile = await prisma.user.findFirst({
        where: {
            id: input.id,
            roles: {
                has: 'INSTRUCTOR'
            }
        },
        include: {
            partnerProfile: true,
            wallet: true
        }
    })

    return profile;
})


export { getPartnerController }