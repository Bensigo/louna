import { ListSessionSchema } from "../../schemas/session";
import { protectedProcedure } from "../../trpc";



export const listSessionsController = protectedProcedure.input(ListSessionSchema).query(async ({ ctx, input }) => {
    const {  prisma } = ctx;
    const { filter, searchName, page, limit } = input;

    const { category } = filter;


    let query = {};
    let orderBySearchRelevance = {}

    if (searchName) {
        query = {
            ...query,
            name: {
                contains: searchName,
                mode: "insensitive",
            },
        }
        orderBySearchRelevance = {
            _relevance: {
                fields: ["name"],
                search: searchName,
                sort: "asc",
            },
        }
    }

    if (!!category){ 

        query = {
            ...query,
            subCategories: {
                has: category
            }
        }
    }


  

    const startIndex = (page - 1) * limit
    // const endIndex = page * limit


    const totalCount = await prisma.session.count({
        where: {
            ...query,
            deleted: false,
            isPublish: true
        },
    })


    const totalPages = Math.ceil(totalCount / limit)


    const sessions = await prisma.session.findMany({
        where: {
            ...query,
            deleted: false,
            isPublish: true
        },
        include: {
            partner: true,
            address: true
        },

        orderBy: {
            ...orderBySearchRelevance,
        },
        skip: startIndex,
        take: limit,
    })
    return {sessions, totalPages}


}) 