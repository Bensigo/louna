import { ListResourcesSchema } from "../../schemas/resources";
import { protectedProcedure } from "../../trpc"

const listResourcesController = protectedProcedure
    .input(ListResourcesSchema)
    .query(async ({ ctx, input }) => {
        const { prisma,  } = ctx
        const {  page, limit } = input.filter;


        const startIndex = (page - 1) * limit

        const totalCount = await prisma.resource.count({
            where: { isPublish: true },
        })

        const totalPages = Math.ceil(totalCount / limit)


        const resources = await prisma.resource.findMany({
            where: {
                isPublish: true
           
            },
            orderBy: {
               
            },
            skip: startIndex || 0,
            take: limit || 50,
        })

     

        return { resources, totalPages }
    })

export { listResourcesController,  }



