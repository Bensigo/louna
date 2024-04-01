import type { MealType, PrismaClient, UserPref } from "@solu/db"

import { recommendRecipes } from "../../ml/recipe/contentBase"
import { ListRecipeSchema } from "../../schemas/recipe"
import { protectedProcedure } from "../../trpc"

const listRecipeController = protectedProcedure
    .input(ListRecipeSchema)
    .query(async ({ ctx, input }) => {
        const { prisma, auth } = ctx
        const userId = auth.userId

        const { filter, searchName } = input

        let listFilter = {}
        let orderBySearchRelevance = {}

        if (searchName) {
            listFilter = {
                ...listFilter,
                OR: [
                    {
                        name: {
                            contains: searchName,
                            mode: "insensitive",
                        },
                        description: {
                            contains: searchName,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            orderBySearchRelevance = {
                _relevance: {
                    fields: ["name", "description"],
                    search: searchName,
                    sort: "asc",
                },
            }
        }

        const recipes = await prisma.recipe.findMany({
            where: {
                ...listFilter,
                mealType: filter.mealType,
                deleted: false,
           
            },
            include: {
                likes: true
            },
            orderBy: {
                ...orderBySearchRelevance,
            },
            skip: filter.skip || 0,
            take: filter.limit || 50,
        })

        // const recommend = await getRecommendRecipes(
        //     prisma,
        //     userId,
        //     filter.mealType,
        //     searchName
        // )
        const recommend = []
        return { recipes, recommend }
    })

export { listRecipeController }

const getRecommendRecipes = async (
    prisma: PrismaClient,
    userId: string,
    mealType: MealType,
    searchName?: string
) => {
    const userPref = await prisma.userPref.findFirst({ where: { userId } })
    if (!userPref) return
    let query = {}
    let orderBySearchRelevance = {}
    if (searchName) {
        query = {
            OR: [
                {
                    name: {
                        contains: searchName,
                        mode: "insensitive",
                    },
                    description: {
                        contains: searchName,
                        mode: "insensitive",
                    },
                },
            ],
        }
        orderBySearchRelevance = {
            _relevance: {
                fields: ["name", "description"],
                search: searchName,
                sort: "asc",
            },
        }
    }

    const recipes = await prisma.recipe.findMany({
        where: { mealType, deleted: false , ...query},
        include: {
            likes: true
        },
        orderBy: {
            ...orderBySearchRelevance
        }
    })

    const currentUserPref = prepareUserPrefData(userPref)
    return recommendRecipes(currentUserPref, recipes)
}

const prepareUserPrefData = (pref: UserPref) => {
    const { foodDislike, mealFrequency, diet, dietPref } = pref
    return {
        foodDislike,
        mealFrequency,
        diet: diet as
            | "Standard"
            | "Vegetarian"
            | "Vegan"
            | "Paleo"
            | "Pescetarian"
            | "Others",
        dietPref,
    }
}
