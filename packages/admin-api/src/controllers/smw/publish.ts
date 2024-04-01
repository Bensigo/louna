import { TRPCError } from "@trpc/server";
import { ById } from "../../schema/shared";
import { protectedProcedure } from "../../trpc";

const publishSMWController = protectedProcedure.input(ById).mutation(async ({ input, ctx }) => {
    const { id } = input;
    const { prisma } = ctx;

    

    // todo: In future to add access magnament to this api 


    const smw = await prisma.sMW.findUnique({ where: { id }})
    if (!smw){
        throw new TRPCError({ code: "NOT_FOUND"})
    }


    console.log({ smw })
    
    const  update = await prisma.sMW.update({
        where: {
            id
        },
        data: {
          isPublished: !smw.isPublished
        }
    })
    return update;
})

export { publishSMWController }