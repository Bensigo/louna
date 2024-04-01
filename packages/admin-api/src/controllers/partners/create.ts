import { TRPCError } from "@trpc/server"

import { CreatePartnerSchema } from "../../schema/partner"
import { protectedProcedure } from "../../trpc"
import { isValidImages } from "../recipe/createRecipe"

const createPartnerProfileController = protectedProcedure
    .input(CreatePartnerSchema)
    .mutation(async ({ ctx, input }) => {
        // check if profile exist with same name
        // validate images
        // create profile
        const { prisma } = ctx
        const { name, bio, images, category, amenities, socials, phone, subCategories } = input
        console.log({ input })
        const exist = await prisma.partner.count({
            where: {
                name,
            },
        })

        console.log({ exist })

        const isExist = exist === 1
        if (isExist) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "partner name already exist",
            })
        }

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

        const partner = await prisma.partner.create({
            data
        })

        return partner
    })

const amenities = ["Bathroom", "Towels", "Locker", "Shower", "WiFi", "Sauna", "Parking"]
export { createPartnerProfileController }


const isValidAmenities = (inputAmenities: string[]): boolean => {
    for (const amenity of inputAmenities) {
        if (!amenities.includes(amenity)) {
            return false; // Found an invalid amenity
        }
    }
    return true; // All amenities are valid
};