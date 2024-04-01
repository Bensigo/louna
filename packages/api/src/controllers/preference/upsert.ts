import { UpsertPrefrence } from "../../schemas/preference"
import { protectedProcedure } from "../../trpc"

export const upsertUserPrefrenceController = protectedProcedure
    .input(UpsertPrefrence)
    .mutation(async ({ ctx, input }) => {
        const { fitness, wellness, diet } = input
        const { auth, prisma } = ctx

        const { userId } = auth


        const existingPref = await prisma.userPref.findFirst({ where: { userId }})
        let pref;
        if (!existingPref){

          pref = await prisma.userPref.create({
            data: {
                userId,
                ...fitness,
                ...wellness,
                ...diet,
            },
        })
        }else {
          pref = await prisma.userPref.update({
            where: {
               id: existingPref.id
            },
            data:{
              userId,
              ...fitness,
              ...wellness,
              ...diet,
             }
          })
      }
  
        

        if (pref) {
            await prisma.user.update({
                where: {
                    id: auth.userId,
                },
                data: {
                    hasPref: true,
                },
            })
        }

        return pref
    })
