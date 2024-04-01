import { z } from "zod";
import { ById } from "../../schema/shared";
import { protectedProcedure } from "../../trpc";


const ListAddressSchema = ById.extend({
    filter: z.object({
        search: z.string().optional()
    }).optional()
})

export const listAddressController = protectedProcedure.input(ListAddressSchema).query( async ({ ctx, input }) => {
    const {id, filter  } = input;


    

    const addresses = await ctx.prisma.address.findMany({
        where: {
            partnerId: id,
            deleted: false,
             ...( filter?.search ? {
                OR:  [
                    {
                        name: {
                            contains: `${filter?.search}`,
                            mode: "insensitive",
                        },
                    },
                    {
                         city: {
                            contains: `${filter?.search}`,
                            mode: "insensitive",
                        },
                    },
                ],
             } : {})
        }
    })

    return addresses;
})