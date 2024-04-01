import { z } from "zod";
import { ByIds } from "../../schema/shared";
import { protectedProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

export const PublishSessionController = protectedProcedure
    .input(ByIds)
    .mutation(async ({ input, ctx }) => {
        const { prisma } = ctx;
        const { ids } = input;

        // Update isPublish to true for sessions with the provided ids
        const updateSessions = await prisma.session.updateMany({
            where: { id: { in: ids }, partner: {
                 isPublished: true
            } },
            data: { isPublish: true },
        });

        // Check if any sessions were updated
        if (updateSessions.count === 0) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "No sessions found with the provided ids",
            });
        }

        return { success: true };
    });
