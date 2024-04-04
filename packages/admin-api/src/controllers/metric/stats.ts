import { UserRole } from "@solu/db";
import { protectedProcedure } from "../../trpc";



const getStatsController = protectedProcedure.query(async ({ ctx } ) => {
    const { prisma } = ctx;


    const totalUsers = await prisma.user.count({
        where: {
             roles: {
                has: UserRole.USER
             }
        }
    })

    const totalActiveUser = await prisma.user.count({
        where: {
            roles: {
                has: UserRole.USER
             },
             isDeleted: false
        }
    })

    const totalPartner = await prisma.partner.count({
        where: {
            
        }
    }) 

    const totalActivePartner = await prisma.partner.count({
        where: {
            isPublished: true
        }
    })

    const totalSubscriber = await prisma.user.count({
        where: {
             roles: {
                has: UserRole.USER
             },
             hasActiveSubscription: true
        }
    }) 

    // add stats for total booking

    return { totalActiveUser, totalUsers,  totalPartner, totalActivePartner, totalSubscriber }
})

export {getStatsController}