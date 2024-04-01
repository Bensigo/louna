import { ResourceById } from "../../schema/resource"
import { protectedProcedure } from "../../trpc"


export const getResourceController = protectedProcedure.input(ResourceById).query( async ({ input, ctx}) => {
    const { id } = input
    return ctx.prisma.resource.findFirst({
        where: {
            id
        }
    })
})