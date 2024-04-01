import { ById } from "../../schema/shared";
import { protectedProcedure } from "../../trpc";


export const getAddressController = protectedProcedure.input(ById).query( async ({ ctx, input }) => {
    const {id } = input;

    const address = await ctx.prisma.address.findFirst({
        where: {
            id,
            deleted: false
        }
    })

    return address;
})