import { publicProcedure } from "../../trpc"

const categories = ["Fitness", "Wellness"]

const subCategories: { name: string; type: "Fitness" | "Wellness" }[] = []

const tags: string[] = []

export const getConfigController = publicProcedure.query(() => {
    // todo cache  api
    return {
        categories,
        subCategories,
        tags,
    }
})
