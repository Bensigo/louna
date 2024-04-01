import { UpdateAddressSchema } from "../../schema/address";
import { protectedProcedure } from "../../trpc";


export const updateAddressController = protectedProcedure.input(UpdateAddressSchema).mutation( async ({ ctx, input }) => {
    const { prisma } = ctx

    const {  name, lat, lng, city, country, building, floor, street, id } = input;




    const data = {
        name,
        lat,
        lng,
        city,
        building,
        street,
        floor,
        country
    }
    // create address 
    const address = await prisma.address.update({
        where:{
            id,
        },
        data
    })
    return address
})