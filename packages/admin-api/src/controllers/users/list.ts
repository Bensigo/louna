import { UserRole } from ".prisma/client"
import { ListPartnersSchema } from "../../schema/user"
import { protectedProcedure } from "../../trpc"

const listUsersController = protectedProcedure
    .input(ListPartnersSchema)
    .query(async ({ ctx, input }) => {
        const { prisma } = ctx

        const { filters, page, limit } = input

        const { isActivated, search } = filters

        const startIndex = (page - 1) * limit

        let query = {}
        let orderBySearchRelevance = {}

      

        if (isActivated) {
            if (isActivated === "true") {
                query = {
                    ...query,
                    metadata: {
                        path: ["isActivated"],
                        equals: true,
                    },
                }
            }
        }

        if (search) {
            query = {
                ...query,
                OR: [
                    {
                        firstname: {
                            contains: `${search}`,
                            mode: "insensitive",
                        },
                    },
                    {
                        lastname: {
                            contains: `${search}`,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            orderBySearchRelevance = {
                _relevance: {
                    fields: ["firstname", "lastname"],
                    search,
                    sort: "asc",
                },
            }
        }

        const totalCount = await prisma.user.count({
            where: query,
        })

        const totalPages = Math.ceil(totalCount / limit)

        const users = await prisma.user.findMany({
            where: {
                ...query,
                roles: {
                    has: UserRole.PARTNER
                },
            },
            skip: startIndex,
            take: limit,
            include: {
                wallet: true,
                partnerProfile: true,
            },
            orderBy: {
                ...orderBySearchRelevance,
            },
        })

        return { users, totalPages }
    })

export { listUsersController }
