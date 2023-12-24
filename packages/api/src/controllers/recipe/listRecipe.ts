
import { ListRecipeSchema } from "../../schemas/recipe";
import { protectedProcedure } from "../../trpc";

/**
 * 
 * for now we just list recipe base on the user nutrition prefrence 
 * in the future we we list base on recommendation and with the use of elastic search
 */

const listRecipeController = protectedProcedure.input(ListRecipeSchema).query(async ({ ctx, input }) => {
    const { prisma } = ctx;

    const { filter, searchName  } = input;

    let listFilter  = {}
    let orderBySearchRelevance = {}

    if(filter.category){
        listFilter  = {
            category: filter.category
        }
    }

    if(searchName){
        listFilter = {
            ...listFilter,
            Name: {
                search: searchName
            }
        }
        orderBySearchRelevance = {
            _relevance: {
                fields: ['Name'],
                search: searchName,
                sort: 'asc'
            }
        }
    }

    const recipes = await prisma.recipe.findMany({
        where: {
          ...listFilter,
        },
        orderBy: {
           ...(orderBySearchRelevance),
        },
        skip: filter.skip || 0,
        take: filter.limit || 50,
    })
    return recipes;
})

export {listRecipeController};