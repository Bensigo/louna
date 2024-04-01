import { InstructorById } from "../../schema/instructor";
import { protectedProcedure } from "../../trpc";


const getInstructorByIdController = protectedProcedure.input(InstructorById).query(async ({ ctx, input }) => {
    const {id } = input;

    const instructor = await ctx.prisma.instrutor.findUnique({
        where: {
            id
        },
        include: {
            smw: true 
        }
    })

    return instructor;
})


export {getInstructorByIdController};