import { ListPartnerSchema } from "../../schemas/partner";
import { protectedProcedure } from "../../trpc";
import { addHours, startOfDay, endOfDay, isToday } from 'date-fns';

// when i get time like this even is same day the query fail 2024-03-19T20:00:00.000Z
export const listPartnerWithSessions = protectedProcedure.input(ListPartnerSchema).query(async ({ ctx, input }) => {
    const {  prisma } = ctx;
    const { filter, searchName, page, limit } = input;

    const { category, date } = filter;


    let query = {};
    let orderBySearchRelevance = {}

    if (searchName) {
        query = {
            ...query,
            name: {
                contains: searchName,
                mode: "insensitive",
            },
        }
        orderBySearchRelevance = {
            _relevance: {
                fields: ["name"],
                search: searchName,
                sort: "asc",
            },
        }
    }

    if (!!category){ 

        query = {
            ...query,
            subCategories: {
                has: category
            }
        }
    }


  

    const startIndex = (page - 1) * limit


        // Get current date
        const today = new Date();
      
        // Set default start and end times
        let startTime = new Date();
        let endTime = new Date();
        const isSameDay = isToday(date);
        console.log({ today: today.toLocaleString() , isSameDay, date: date.toLocaleString() })
        
        // Check if the date is today
        if (isSameDay) {
            // Date is today, add 1 hour ahead of current time
            startTime = addHours(today, 1);
            // Set end time to 9 PM
            endTime = new Date(today);
            endTime.setHours(21, 0, 0, 0);
        } else {
            // Date is not today, so set start time to 5 AM
            startTime = startOfDay(date);
            startTime.setHours(5, 0, 0, 0)
            // Set end time to 9 PM
            endTime = endOfDay(date);
            endTime.setHours(21, 0, 0, 0); // 9 PM
        }

    const totalCount = await prisma.partner.count({
        where: {
            ...query,
            deleted: false,
            isPublished: true,
            sessions: {
                some: {
                    AND: [
                        { startTime: { gte: startTime }},
                        { endTime: { lte: endTime }}
                    ]
                }
            }
        },
        
    })


    const totalPages = Math.ceil(totalCount / limit)


    const partners = await prisma.partner.findMany({
        where: {
            ...query,
            deleted: false,
            isPublished: true,
            sessions: {
                some: {
                    AND: [
                        { startTime: { gte: startTime }},
                        { endTime: { lte: endTime }}
                    ]
                }
            }
        },
        include: {
           addresses: true
        },

        orderBy: {
            ...orderBySearchRelevance,
        },
        skip: startIndex,
        take: limit,
    })
    return {partners, totalPages}
})