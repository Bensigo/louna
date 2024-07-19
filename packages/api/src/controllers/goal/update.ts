import { UpdateGoalSchema } from "../../schemas/goal";
import { protectedProcedure, type Context } from "../../trpc";


export const UpadteGoalController = protectedProcedure.input(UpdateGoalSchema).mutation(({ctx, input}) => {
    const { name, value } = input
    return updateGoalHandler(ctx, name, value)
})

async function  updateGoalHandler(ctx: Context, name: string, value: number) {
    const { prisma, auth } = ctx
    const { userId  } = auth;
    console.log({ userId, name, value })
    const update = await prisma.goal.updateMany({
        where: {
            userId: userId as string,
            name
        },
        data: {
            value: String(value)
        }
    })
  console.log({ update: update.count  })
    return { update: update.count === 1}

}