import { ById } from "../../schemas/common/base"
import { protectedProcedure } from "../../trpc"


export const getResourceController = protectedProcedure.input(ById).query( async ({ input, ctx}) => {
    const { id } = input
    return ctx.prisma.resource.findFirst({
        where: {
            id
        }
    })
})