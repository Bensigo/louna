import { UserRole } from ".prisma/client"
import { ListUsersSchema } from "../../schema/user"
import { protectedProcedure } from "../../trpc"

const listUsersController = protectedProcedure
    .input(ListUsersSchema)
    .query(async ({ ctx, input }) => {
        const { prisma } = ctx

        const { filters, page, limit } = input

        const { search, isSubscribe } = filters

        const startIndex = (page - 1) * limit

        let query = {}
        let orderBySearchRelevance = {}

      


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
                ...(isSubscribe ? { hasActiveSubscription: true }: {}),
                roles: {
                    has: UserRole.USER
                },
            },
            skip: startIndex,
            take: limit,
            include: {
                wallet: true,
                userPref: true
           
            },
            orderBy: {
                ...orderBySearchRelevance,
            },
        })

        return { users, totalPages }
    })

export { listUsersController }
