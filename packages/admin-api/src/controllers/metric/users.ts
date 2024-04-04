import { TRPCError } from "@trpc/server"

import { ChartFilterSchema } from "../../schema/metrics"
import { protectedProcedure } from "../../trpc"

type UserData = {
    date: Date
    count: number
}

export const getUsersMetricController = protectedProcedure
    .input(ChartFilterSchema)
    .query(async ({ ctx, input }) => {
        const { timeRange } = input

        const { prisma } = ctx

        let startDate: Date

        switch (timeRange) {
            case "day":
                startDate = new Date()
                startDate.setHours(startDate.getHours() - 24)
                break

            case "week":
                startDate = new Date()
                startDate.setDate(startDate.getDate() - 7)
                break
            case "month":
                startDate = new Date()
                startDate.setMonth(startDate.getMonth() - 1)
            case "year":
                startDate = new Date()
                startDate.setFullYear(startDate.getFullYear() - 1)
                break
            default:
                startDate = new Date()
                startDate.setHours(startDate.getHours() - 24)
                break
        }

        const interval = (() => {
            switch (timeRange) {
                case "day":
                    return "hour"
                case "week":
                    return "day"
                case "month":
                    return "month"
                case "year":
                    return "month"
                default:
                    return "hour"
            }
        })()
        try {
            const userData: UserData[] = await prisma.$queryRaw`
            SELECT
              date_trunc(${interval}, "createdAt"::timestamp) as date,
              COUNT(*)::integer  AS count
            FROM
              "User"
            WHERE
              "createdAt" >= ${startDate}
              AND roles::text[] @> ARRAY['USER']::text[]
            GROUP BY
              date
            ORDER BY
              date DESC;
          `;
          
     
            return userData
        } catch (error) {
            console.error("Error fetching user data:", error)
            throw new TRPCError({
                message: "Error fetching user data",
                code: "INTERNAL_SERVER_ERROR",
            })
        }
    })
