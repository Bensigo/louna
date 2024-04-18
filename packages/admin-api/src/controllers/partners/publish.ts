import { TRPCError } from "@trpc/server";
import { ById } from "../../schema/shared";
import { protectedProcedure } from "../../trpc";


export const publishPartnerController = protectedProcedure.input(ById).mutation(async ({ input, ctx }) => {
    const { id } = input;
    const { prisma } = ctx;

    

    // todo: In future to add access magnament to this api 


    const partner = await prisma.partner.findUnique({ where: { id }})
    if (!partner){
        throw new TRPCError({ code: "NOT_FOUND"})
    }



    
    const  update = await prisma.partner.update({
        where: {
            id
        },
        data: {
          isPublished: !partner.isPublished
        }
    })
    return update;
})