import { UserRole } from "@solu/db";
import { protectedProcedure } from "../../trpc";

const getStatsController = protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const [totalUsers, totalActiveUser, totalPartner, totalActivePartner, totalSubscriber] = await prisma.$transaction([
        prisma.user.count({
            where: {
                roles: { has: UserRole.USER }
            }
        }),
        prisma.user.count({
            where: {
                roles: { has: UserRole.USER },
                isDeleted: false
            }
        }),
        prisma.partner.count(),
        prisma.partner.count({
            where: {
                isPublished: true
            }
        }),
        prisma.user.count({
            where: {
                roles: { has: UserRole.USER },
                hasActiveSubscription: true
            }
        })
    ]);

    return { totalActiveUser, totalUsers, totalPartner, totalActivePartner, totalSubscriber };
});

export { getStatsController };
