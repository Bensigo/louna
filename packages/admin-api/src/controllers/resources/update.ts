import { TRPCError } from "@trpc/server";
import { UpdateResource } from "../../schema/resource";
import { protectedProcedure } from "../../trpc";
import { isValidImages } from "../recipe/createRecipe";


export const updateResourceController = protectedProcedure.input(UpdateResource).mutation( async ({ input, ctx}) => {
    const { tags, title, url, image, id, videoUrl, contentType, description  } = input;
    const {  prisma } = ctx;



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