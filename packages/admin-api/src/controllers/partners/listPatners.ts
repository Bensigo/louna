import { ListPartnersSchema } from "../../schema/partners";
import { protectedProcedure } from "../../trpc";



const listPatnersController  = protectedProcedure.input(ListPartnersSchema).query(async ({ctx, input }) => {
    const { prisma, auth } = ctx;

    const partners = await prisma.user.findMany({
        where: {
            roles: {
                has: 'INSTRUCTOR'
            }
        },
        skip: input.skip,
        take: input.limit,
        include: {
            wallet: true,
            partnerProfile: true
        }
    }, )

    return partners;
})

export { listPatnersController }