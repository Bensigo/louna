import { ListSMWSchema } from "../../schemas/smw"
import { protectedProcedure } from "../../trpc"

const listSmwController = protectedProcedure
    .input(ListSMWSchema)
    .query(async ({ ctx, input }) => {
        const { prisma, auth } = ctx
        const userId = auth.userId

        const { filter, searchTerm } = input

        let listFilter = {}
        let orderBySearchRelevance = {}

        if (searchTerm) {
            listFilter = {
                ...listFilter,
                OR: [
                    {
                        title: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                        description: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            orderBySearchRelevance = {
                _relevance: {
                    fields: ["title", "description"],
                    search: searchTerm,
                    sort: "asc",
                },
            }
        }

        const smws = await prisma.sMW.findMany({
            where: {
                ...listFilter,
                isPublished: true,
                subCategories: {
                   has: filter.category
                },
                deleted: false,
           
            },
            orderBy: {
                ...orderBySearchRelevance,
            },
            skip: filter.skip || 0,
            take: filter.limit || 50,
        })

      
       return smws
    })

export { listSmwController }