import { type MealType } from "@solu/db"
import { ListRecipeSchema } from "../../schema/recipe"
import { protectedProcedure } from "../../trpc"

export const listRecipeController = protectedProcedure
    .input(ListRecipeSchema)
    .query(async ({ ctx, input }) => {
        // hello write code here
        const { prisma } = ctx
        const { filter,  page, limit  } = input
        const { searchName, mealType, isApproved } = filter;

        let query = {}
        let orderBySearchRelevance = {}

        if (mealType?.length) {
            query = {
                mealType: {
                    in: mealType
                },
            }
        }

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

        if (isApproved === 'true'){
            query = {
                ...query,
                 isApproved: true 
            }
        }

        const startIndex = (page - 1) * limit
        // const endIndex = page * limit


        const totalCount = await prisma.recipe.count({
            where: query,
        })

        const totalPages = Math.ceil(totalCount / limit)

        const recipes = await prisma.recipe.findMany({
            where: {
                ...query,
                deleted: false
            },
            orderBy: {
                ...orderBySearchRelevance,
            },
            skip: startIndex,
            take: limit,
        })
        return {recipes, totalPages}
    })
