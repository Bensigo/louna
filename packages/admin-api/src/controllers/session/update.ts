
import { TRPCError } from "@trpc/server";
import { UpdateSessionSchema } from "../../schema/session";
import { protectedProcedure } from "../../trpc";
import { parseISO } from 'date-fns';
import { InstructorCategory } from "@solu/db";



const updateSessionController = protectedProcedure.input(UpdateSessionSchema).mutation(async ({ input, ctx }) => {
    const { prisma} = ctx;
    const { id,title, startTime, endTime, addressId, partnerId, description, category, subCategories, point, capacity } = input;

    // Check if the partner exists
    const partnerCount = await prisma.partner.count({ where: { id: partnerId } });
    if (partnerCount !== 1) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid Partner'
        });
    }

    // Check if the address exists
    const addressCount = await prisma.address.count({ where: { id: addressId } });
    if (addressCount !== 1) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid Address, address required'
        });
    }

    // Parse start and end times into Date objects
    const parsedStartTime = parseISO(startTime);
    const parsedEndTime = parseISO(endTime);

    // Create the session
    const data =  {
        title,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        addressId,
        partnerId,
        description,
        category: category === 'Fitness'? InstructorCategory.Fitness : InstructorCategory.Wellness,
        subCategories,
        capacity,
        point
    }
    const createdSession = await prisma.session.update({
        where: {
            id
        },
        data: {
            ...data
        }
    });

    return createdSession;
});

export { updateSessionController };
