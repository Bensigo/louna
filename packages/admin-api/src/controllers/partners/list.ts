import { ListPartnerSchema } from "../../schema/partner"
import { protectedProcedure } from "../../trpc"

export const listPartnerController = protectedProcedure
    .input(ListPartnerSchema)
    .query(async ({ input, ctx }) => {
        const { page, filter, limit } = input
        const { searchTerm, category, isPublished } = filter

        const { prisma } = ctx;

        let query = {}
        let orderBySearchRelevance = {}

        const startIndex = (page - 1) * limit

        if (searchTerm) {
            query = {
                ...query,
                name: {
                    contains: `${searchTerm}`,
                    mode: "insensitive",
                },
            }
            orderBySearchRelevance = {
                _relevance: {
                    fields: ["name"],
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


        const totalCount = await prisma.partner.count({
            where: query,
        })
    
        const totalPages = Math.ceil(totalCount / limit)

        const partners = await prisma.partner.findMany({
            where: {...query, deleted: false },
            skip: startIndex,
            take: limit,
            orderBy: {
                ...orderBySearchRelevance,
            },
        })
    
        return { partners, totalPages }



    })
