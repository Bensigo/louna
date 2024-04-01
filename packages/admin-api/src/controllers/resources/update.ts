import { UpdateResource } from "../../schema/resource";
import { protectedProcedure } from "../../trpc";
import { isValidImages } from "../recipe/createRecipe";


export const updateResourceController = protectedProcedure.input(UpdateResource).mutation( async ({ input, ctx}) => {
    const { tags, title, url, image, id } = input;
    const {  prisma } = ctx;


    const isImagesValid = await isValidImages([image.key], prisma)

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
                in: image.key,
            },
        },
        data: {
            isValid: true,
        },
    })

    const resource = await prisma.resource.update({
        where: {
            id: input.id
        },
        data: {
            title,
            url,
            image: {
                key: image.key,
                repo: image.repo
            },
            tags
        }
    })
    return resource;
})