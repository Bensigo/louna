import { TRPCError } from "@trpc/server";
import { CreateAddresSchema } from "../../schema/address";
import { protectedProcedure } from "../../trpc";


export const createAddressController = protectedProcedure.input(CreateAddresSchema).mutation( async ({ ctx, input }) => {
    const { prisma } = ctx

    const { partnerId: id, name, lat, lng, city, country, building, floor, street } = input;

    const partner = await prisma.partner.findFirst({
        where: {
            id,
            deleted: false
        }
    })

    if (!partner){
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Partner not found'
        })
    }
    const data = {
        name,
        lat,
        lng,
        city,
        building,
        street,
        floor,
        country,
        partnerId: id
    }
    // create address 
    const address = await prisma.address.create({
        data
    })
    return address
})