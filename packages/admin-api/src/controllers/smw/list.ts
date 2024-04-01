import { ListSMWSchema } from "../../schema/smw"
import { protectedProcedure } from "../../trpc"

export const listSMWController = protectedProcedure
    .input(ListSMWSchema)
    .query(async ({ input, ctx }) => {
        const { page, filter, limit } = input
        const { searchTerm, category, isPublished, contentType } = filter

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

        if (category != "All"){
            query = {
                ...query,
                category
            }
        }

        if (isPublished === "true"){
            query = {
                ...query,
                isPublished: true 
            }
        }

        if(contentType != "All"){
            query = {
                ...query,
                contentType
            }
        }


        const totalCount = await prisma.sMW.count({
            where: query,
        })
    
        const totalPages = Math.ceil(totalCount / limit)

        const smws = await prisma.sMW.findMany({
            where: {...query, deleted: false },
            skip: startIndex,
            take: limit,
            orderBy: {
                ...orderBySearchRelevance,
            },
        })
    
        return { smws, totalPages }



    })
