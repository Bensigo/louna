// import { type z } from "zod";
// import {type  ById } from "../../schemas/common/base";
import { type Context,  protectedProcedure } from "../../trpc";


// type Input = z.infer<typeof ById>


export const getUserGoalController = protectedProcedure.query(async ({ ctx }) => {
   const goals = await  handleGetUserGoals(ctx)
   return goals;

})




async function handleGetUserGoals(ctx: Context ){
    const { prisma, auth } = ctx;
    const userId = auth.userId as string



    const goals = await prisma.goal.findMany({
        where: {
            userId
        }
    })

    
    if (goals.length){
        return goals
    }
 
    const stepGoal = '8000'
    const energyBurnedGoal = '1300'
    const stretchingGoal = '7'
    const breathingGoal = '5'

  
     await prisma.goal.createMany({
        data: [
            {
                name: 'steps',
                value: stepGoal,
                userId,
            },
            {
                name: 'energyBurned',
                value: energyBurnedGoal,
                userId,
            },
            {
                name: 'breathing',
                value: breathingGoal,
                userId,
            },
            {
                name: 'stretching',
                value: stretchingGoal,
                userId
            }
        ]
    })
   
    const newGoals = await prisma.goal.findMany({
        where: {
            userId
        }
    })
    return newGoals;

}