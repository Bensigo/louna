import { ById } from "../../schema/user";
import { protectedProcedure } from "../../trpc";



const getPartnerController = protectedProcedure.input(ById).query(async ({ ctx, input }) => {
    const prisma = ctx.prisma;

    const profile = await prisma.user.findFirst({
        where: {
            id: input.id,
            roles: {
                has: 'USER'
            }
        },
        include: {
            wallet: true,
            userPref: true
        }
    })

    return profile;
})


export { getPartnerController }