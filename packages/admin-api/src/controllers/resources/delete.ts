import { ResourceById } from "../../schema/resource";
import { protectedProcedure } from "../../trpc";


export const deleteResourceController = protectedProcedure.input(ResourceById).mutation( async ({ input, ctx}) => {
    const { id } = input
    return ctx.prisma.resource.delete({
        where: {
            id
        }
    })
})