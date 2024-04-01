import { ListResourceSchema } from "../../schema/resource"
import { protectedProcedure } from "../../trpc"

export const listResourceController = protectedProcedure
    .input(ListResourceSchema)
    .query(async ({ input, ctx }) => {
        const {  filter, searchTerm } = input
        const {  type, limit, page } = filter

        const { prisma } = ctx;

        let query = {}
        let orderBySearchRelevance = {}

        const startIndex = (page - 1) * limit

        if (searchTerm) {
            query = {
                ...query,
                title: {
                    contains: `${searchTerm}`,
                    mode: "insensitive",
                },
            }
            orderBySearchRelevance = {
                _relevance: {
                    fields: ["title"],
                    search: searchTerm,
                    sort: "asc",
                },
            }
        }

        if (type  === 'Publish'){
            query = {
                ...query,
                isPublish: true
            }
        }

        if (type === "unPublish"){
            query = {
                ...query,
                isPublish: false 
            }
        }


        const totalCount = await prisma.resource.count({
            where: query,
        })
    
        const totalPages = Math.ceil(totalCount / limit)

        const resources = await prisma.resource.findMany({
            where: {...query },
            skip: startIndex,
            take: limit,
            orderBy: {
                ...orderBySearchRelevance,
            },
        })
    
        return { resources, totalPages }



    })
