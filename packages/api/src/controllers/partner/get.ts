import { z } from "zod";
import { ById } from "../../schemas/common/base";
import { protectedProcedure } from "../../trpc";
import { endOfDay, addHours, isToday, startOfDay } from 'date-fns'


export const getPartnerWithSessoions = protectedProcedure.input(ById.extend({ date: z.date() })).query(async ({ input, ctx}) => {
    const { prisma } = ctx;
    const { id, date } = input



    const isSameDay = isToday(date);
    let startTime;
    let endTime;
    
    if (isSameDay){
        const today = new Date()
        // Calculate start time (current time plus an hour)
         startTime = addHours(today, 1);
          // Calculate end time (10 PM today)
        endTime = endOfDay(today);
        endTime.setHours(22, 0, 0, 0); // 10 PM
    }else {
        startTime = startOfDay(date);
        startTime.setHours(5, 0, 0, 0)
        // Set end time to 9 PM
        endTime = endOfDay(date);
        endTime.setHours(22, 0, 0, 0)
    }

 
 

      
   
       // Query partner with sessions between the start time and end time
       const partner = await prisma.partner.findUnique({
           where: {
               id: id,
           },
           include: {
              addresses: true,
               sessions: {
                   where: {
                       AND: [
                           { startTime: { gte: startTime } },
                           { endTime: { lte: endTime } }
                       ]
                   }
               }
           }
       });
   
       return partner;
})