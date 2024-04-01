import { PublishResource } from "../../schema/resource"
import { protectedProcedure } from "../../trpc"

export const pushlishResourceController = protectedProcedure.input(PublishResource).mutation( async ({ input, ctx}) => {
    const { ids , type } = input
    const update = await  ctx.prisma.resource.updateMany({
        where: {
            id: {
                in: ids
                
            }
        },
        data: {
            ...(type === 'Publish'? { isPublish: true }: { isPublish: false })
        }
    })
    return update;
})