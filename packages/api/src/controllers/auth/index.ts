import schemas from "../../schemas"
import { protectedProcedure } from "../../trpc"
import {
    generateReadSignedUrl,
    generateWriteSignedUrl,
} from "../../utils/signedUrls"

export const getProfile = protectedProcedure.query(async ({ ctx }) => {
    const { auth, prisma } = ctx
    
    const user = await prisma.user.findUnique({
        where: {
            id: auth.userId,
        },
        include: {
            wallet: true,
            userPref: true
        }
    })
    return user
})

export const updateProfile = protectedProcedure
    .input(schemas.auth.updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
        const { auth, prisma } = ctx

        const update = await prisma.user.update({
            where: {
                id: auth.userId,
            },
            data: {
                firstname: input.firstname,
                lastname: input.lastname,
                birthdate: Number(input.age )
            },
        })
        console.log({ update })
        const userPref =  await prisma.userPref.update({
            where: {
                userId: auth.userId
            },
            data: {
                age:  Number(input.age)
            }
         })
         console.log({ userPref })
        return update;
    })

export const getProfilePictureUploadUrl = protectedProcedure.query(
    ({ ctx }) => {
        const { auth } = ctx

        const filePath = `profilePicture/${auth.userId}`

        return generateWriteSignedUrl(filePath)
    },
)

export const getProfilePictureUrl = protectedProcedure.query(({ ctx }) => {
    const { auth } = ctx

    const filePath = `profilePicture/${auth.userId}`

    return generateReadSignedUrl(filePath)
})
