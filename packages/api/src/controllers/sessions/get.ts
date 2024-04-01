import { ById } from "../../schemas/common/base"
import { protectedProcedure } from "../../trpc"

export const getSessionController = protectedProcedure
    .input(ById)
    .query(async ({ input, ctx }) => {
        const { prisma } = ctx

        const { id } = input

        const session = await prisma.session.findFirst({
            where: {
                id,
                isPublish: true,
                deleted: false,
            },
            include: {
                partner: true,
                address: true
            },
        })

        return session
    })
