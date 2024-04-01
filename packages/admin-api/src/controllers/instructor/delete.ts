
import { ById } from "../../schema/shared";
import { protectedProcedure } from "../../trpc";


export const deleteInstructorController = protectedProcedure.input(ById).mutation(async ({input, ctx }) => {
    const { prisma } = ctx;
    const {id } = input;

    const deletedInstructor = await prisma.instrutor.update({
        where: {
            id
        },
        data: {
            deleted: true,
            isActive: false
        }
    })
   if (deletedInstructor){
    await prisma.sMW.updateMany({
        where: {
            instructorId: deletedInstructor.id
        },
        data: {
            deleted: true,
            isPublished: false
        }
    })
   }


    return !!deletedInstructor;
})