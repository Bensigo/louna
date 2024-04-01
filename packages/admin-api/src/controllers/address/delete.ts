
import { ById } from "../../schema/shared";
import { protectedProcedure } from "../../trpc";


export const deleteAddressController = protectedProcedure.input(ById).mutation(async ({input, ctx }) => {
    const { prisma } = ctx;
    const {id } = input;

    const deleted = await prisma.address.update({
        where: {
            id
        },
        data: {
            deleted: true,
         
        }
    })



    return !!deleted;
})