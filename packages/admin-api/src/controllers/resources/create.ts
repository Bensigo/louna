import { ResourceSchema } from "../../schema/resource";
import { protectedProcedure } from "../../../../api/src/trpc";
import { isValidImages } from "../recipe/createRecipe";
import { TRPCError } from "@trpc/server";


export const createResourceController = protectedProcedure.input(ResourceSchema).mutation( async ({ input, ctx}) => {
    const { tags, title, url, image , videoUrl, contentType, description} = input;
    const {  prisma } = ctx;


   
    const isImagesValid = await isValidImages([image.key], prisma)

    if (contentType === 'Video'){
        const [vidRepo, vidKey] = videoUrl.split('/')
        const isVidValid = await isValidImages([vidKey], prisma)

        if (!isVidValid) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "invalid video",
            })
        }
        // update validated images
        await prisma.file.updateMany({
            where: {
                key: {
                    in: vidKey,
                },
            },
            data: {
                isValid: true,
            },
        })
    }

  


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

    const resource = await prisma.resource.create({
        data: {
            title,
           
            contentType,
            image: {
                key: image.key,
                repo: image.repo
            },
            tags,
            ...(url ? { url }: {}),
            ...(videoUrl ? { videoUrl }: {}),
            ...(description ? { description }: {})
        }
    })
    return resource;
})