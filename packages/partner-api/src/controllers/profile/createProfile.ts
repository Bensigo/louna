import { type BusinessType } from "@solu/db";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import { createPartnerProfileSchema } from "../../schema/partner/profile";

const createProfileController = protectedProcedure
    .input(createPartnerProfileSchema)
    .mutation(async ({ ctx, input }) => {

        const { prisma, auth } = ctx;
        const { businessType, bio, title , activities } = input;

        const userId = auth.userId

        const isValid = isValidActivites(businessType, activities);
        if(!isValid){
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid activities ",
            })
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const profile  = await prisma.partnerProfile.create({
            data: {
                userId,
                businessType,
                bio,
                title,

            }
        })

        const currentUser  = await prisma.user.findFirst({
            where: {
                id: userId
            },
            include: {
                partnerProfile: true
            }
        })

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                metadata: {
                    ...(currentUser?.metadata || {}),
                    hasSetup: true,
                }
            }
        })

        return profile;

    })


export { createProfileController }  

const isValidActivites = (type: BusinessType, activities: string[]) => {
    const currActivities =  soluActivities[type] as string[];
    if(!currActivities)return false;
    return  isValid(currActivities, activities);
}


function isValid(soluActivities: string[], userActivities: string[]): boolean {
    const lowercaseSoluActivities = soluActivities.map(item => item.toLowerCase())
    // Use every() to check if every element in array1 is in array2
    return userActivities.every((element) => lowercaseSoluActivities.includes(element));
  }

const soluActivities = {
    WELLNESS: ['Meditation', 'Yoga', 'Breath work', 'Aromatherapy', "Sound Healing"],
    FITNESS: ['Cycling', 'Pilates', 'CrossFit', 'Kick boxing', 'Dance Fitness', 'Running', 'Pole dacing', 'Boxing']
}