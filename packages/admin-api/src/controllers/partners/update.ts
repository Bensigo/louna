
import { TRPCError } from "@trpc/server"

import {  UpdatePartnerSchema } from "../../schema/partner"
import { protectedProcedure } from "../../trpc"
import { isValidImages } from "../recipe/createRecipe"

const updatePartnerProfileController = protectedProcedure
    .input(UpdatePartnerSchema)
    .mutation(async ({ ctx, input }) => {
        // check if profile exist with same name
        // validate images
        // create profile
        const { prisma } = ctx
        const { name, bio, images, category, amenities, socials, phone, id, subCategories } = input
    
    

      

      

        const imageKeys = images.map((img) => img.key)

        const isImagesValid = await isValidImages(imageKeys, prisma)

        if (!isImagesValid) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "invalid images",
            })
        }
        // update validated images
        await prisma.file.updateMany({
            where: {
                key: {
                    in: imageKeys,
                },
            },
            data: {
                isValid: true,
            },
        })

        if(amenities?.length){

        // validate amenities 
        const hasValidAmenities = isValidAmenities(amenities)

        if (!hasValidAmenities){
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "invalid Amenities",
            })
        }
        }

        // create profile

        const data = {
            name,
            images,
            category,
            subCategories,
            bio,
            ...(amenities && amenities.length > 1 && { amenities }),
            ...(socials && socials.length > 0 && { socials }),
            phone,
          }

        const partner = await prisma.partner.update({
            where: {
                id,
            },
            data,
        })

        return partner
    })

const amenities = ["Bathroom", "Towels", "Locker", "Shower", "WiFi", "Sauna", "Parking"]
export { updatePartnerProfileController }


const isValidAmenities = (inputAmenities: string[]): boolean => {
    for (const amenity of inputAmenities) {
        if (!amenities.includes(amenity)) {
            return false; // Found an invalid amenity
        }
    }
    return true; // All amenities are valid
};