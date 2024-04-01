import { TRPCError } from "@trpc/server";
import { CreateSessionSchema } from "../../schema/session";
import { protectedProcedure } from "../../trpc";
import { parseISO } from 'date-fns';
import { InstructorCategory } from "@solu/db";

const createSessionController = protectedProcedure.input(CreateSessionSchema).mutation(async ({ input, ctx }) => {
    const { prisma} = ctx;
    const { title, startTime, endTime, addressId, partnerId, category, tags, point, capacity, isPublish } = input;

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
    
    // currently we will allow conccurent session to be book until we need to change it
    // // Check if there's an existing session with the same name, time, and partnerId
    // const existingSession = await prisma.session.findFirst({
    //     where: {
    //         title,
    //         startTime: parsedStartTime,
    //         endTime: parsedEndTime,
    //         partnerId,
    //         category: 
    //     }
    // });

    // if (existingSession) {
    //     throw new TRPCError({
    //         code: 'BAD_REQUEST',
    //         message: 'Session with the same name, time, and partner already exists'
    //     });
    // }

    // Create the session
    const data =  {
        title,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        addressId,
        partnerId,
       ...(isPublish === 'publish' ? { isPublish: true }: {}),
        category: category === 'Fitness'? InstructorCategory.Fitness : InstructorCategory.Wellness,
        tags,
        capacity,
        point
    }
    console.log({ data })
    const createdSession = await prisma.session.create({
        data
    });

    return createdSession;
});

export { createSessionController };
