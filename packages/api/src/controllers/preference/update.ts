import { z } from "zod";
import { protectedProcedure } from "../../trpc";

const UpdateUserPrefSchema = z.object({
  height: z.number().optional(),
  weight: z.number().optional(),
  dietPref: z.string().optional(),
  existingInjuries: z.array(z.string()).optional(),
  foodDislikes: z.array(z.string()).optional(),
  fitnessGoal: z.array(z.string()).optional(),
  fitnessLevel: z.string().optional(),
});

export const updatePrefController = protectedProcedure
  .input(UpdateUserPrefSchema)
  .mutation(async ({ input, ctx }) => {
    const { auth, prisma } = ctx;
    const { userId } = auth;

    const { height, weight, fitnessGoal, fitnessLevel, foodDislikes, existingInjuries, dietPref } = input;

    const existingUserPref = await prisma.userPref.findUnique({
      where: {
        userId,
      },
    });

    if (!existingUserPref) {
      throw new Error("User preferences not found");
    }

    let data = {};

    if (dietPref){
        data = { ...data, dietPref }
    }

    if (height) {
       data = {...data, height}
    }
    if (weight) {
      data = {...data, weight }
    }

    if (fitnessGoal && fitnessGoal?.length > 0){
      data = {...data, fitnesGoal: fitnessGoal }
    }

    if (fitnessLevel){
      data = {...data, fitnessLevel }
    }


    if (foodDislikes && foodDislikes.length > 0){
      data = {...data, foodDislike: foodDislikes }
    }


    if (existingInjuries && existingInjuries.length > 0 ){
      data = {...data, healthConditions: existingInjuries }
    }







    const update = await prisma.userPref.update({
      where: {
        userId,
      },
      data,
    });

    return update;
  });
