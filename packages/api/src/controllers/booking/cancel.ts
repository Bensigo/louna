import { TRPCError } from "@trpc/server";
import { differenceInHours } from "date-fns";
import { z } from "zod";

import { ById } from "../../schemas/common/base";
import { protectedProcedure } from "../../trpc";

const cancellationReasons = new Set([
    "Too far from me",
    "Too expensive",
    "Something came up",
    "Saw something better",
    "Others",
]);

export const cancelBookingController = protectedProcedure
    .input(
        ById.extend({
            reasons: z.array(z.string()).min(1),
        }),
    )
    .mutation(async ({ ctx, input }) => {
        const { id, reasons } = input;
        const { prisma, auth } = ctx;
        const { userId } = auth;

        // Validate reasons
        const isValidReason = reasons.some((reason) => cancellationReasons.has(reason));

        if (!isValidReason) {
            throw new TRPCError({
                message: `Invalid cancellation reason: ${reasons.join(", ")}`,
                code: "BAD_REQUEST",
            });
        }

        const booking = await prisma.booking.findFirst({
            where: { id },
            include: { session: true },
        });

        if (!booking) {
            throw new TRPCError({
                message: `Booking not found for ID: ${id}`,
                code: "NOT_FOUND",
            });
        }

        const { session } = booking;
        const currentTime = new Date();
        const sessionStartTime = new Date(session.startTime);

        const timeDiffHours = differenceInHours(currentTime, sessionStartTime);

        // Calculate credit amount to return
        let creditAmountToReturn = 0;
        if (timeDiffHours >= 24) {
            // 1 day or more - full credit return
            creditAmountToReturn = booking.points || 0;
        } else if (timeDiffHours <= 3) {
            // 3 hours or less - 30% return
            creditAmountToReturn = (booking.points || 0) * 0.3;
        } else if (timeDiffHours >= 8) {
            // 8 hours or more - 50% credit return
            creditAmountToReturn = (booking.points || 0) * 0.5;
        }

        // Update booking, session, and wallet in a single transaction
        await prisma.$transaction([
            prisma.booking.update({
                where: { id },
                data: { isCanceled: true, cancellationReasons: reasons },
            }),
            prisma.session.update({
                where: { id: session.id },
                data: { capacity: { increment: 1 } },
            }),
            prisma.wallet.update({
                where: { userId },
                data: {
                    point: { increment: creditAmountToReturn },
                    logs: {
                        create: {
                            point: session.point,
                            type: "Credit",
                            reasons: [`Refunds for ${session.id} session`],
                        },
                    },
                },
            }),
        ]);

        return { success: true };
    });
