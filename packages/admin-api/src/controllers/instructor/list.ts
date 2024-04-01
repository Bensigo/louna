import { ListInstructorSchema } from "../../schema/instructor";
import { protectedProcedure } from "../../trpc";


const listInstructorController = protectedProcedure.input(ListInstructorSchema).query( async ({ ctx, input }) => {
    const { prisma } = ctx
    const { filter,  page, limit  } = input
    const { searchName, category , isActive } = filter;

    let query = {}
    let orderBySearchRelevance = {}

    const startIndex = (page - 1) * limit


    if (searchName) {
    
            query = {
                ...query,
                OR: [
                    {
                        firstname: {
                            contains: `${searchName}`,
                            mode: "insensitive",
                        },
                    },
                    {
                        lastname: {
                            contains: `${searchName}`,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            orderBySearchRelevance = {
                _relevance: {
                    fields: ["firstname", "lastname"],
                    search: searchName,
                    sort: "asc",
                },
            }
        
    }

    if (isActive === 'true'){
        query = {
            ...query,
            isActive: true 
        }
    }

    if (category){
        query = {
            category
        }
    }
   
    const totalCount = await prisma.instrutor.count({
        where: query,
    })

    const totalPages = Math.ceil(totalCount / limit)

    const instructors = await prisma.instrutor.findMany({
        where: {...query},
        skip: startIndex,
        take: limit,
        orderBy: {
            ...orderBySearchRelevance,
        },
    })

    return { instructors, totalPages }


})


export { listInstructorController }