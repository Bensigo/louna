import { ListSessionSchema } from "../../schema/session";
import { protectedProcedure } from "../../trpc";
import { parseISO } from "date-fns";

export const listSessionController = protectedProcedure
  .input(ListSessionSchema)
  .query(async ({ input, ctx }) => {
    const { page, filter, limit } = input;
    const { search: searchTerm, category, status, startTime, endTime, partnerId } =
      filter || {};

    const { prisma } = ctx;

    let query: any = { deleted: false };
    let orderBySearchRelevance: any = {};

    const startIndex = (page - 1) * limit;

    if (searchTerm) {
      query = {
        ...query,
        title: {
          contains: `${searchTerm}`,
          mode: "insensitive",
        },
      };
      orderBySearchRelevance = {
        _relevance: {
          fields: ["title"],
          search: searchTerm,
          sort: "asc",
        },
      };
    }

    if (category !== "All") {
      query = {
        ...query,
        category,
      };
    }
    if (status === "Published") {
        console.log("got here!!!", status)
      query = {
        ...query,
        isPublish: true,
      };
    }

    if (startTime || endTime) {
      const whereTime: any = {};

      if (startTime) {
        whereTime.startTime = {
          gte: parseISO(startTime),
        };
      }

      if (endTime) {
        whereTime.endTime = {
          lte: parseISO(endTime),
        };
      }

      query = {
        ...query,
        AND: whereTime,
      };
    }
    console.log({ query })
    const totalCount = await prisma.session.count({
      where: query,
    });

    const totalPages = Math.ceil(totalCount / limit);

    const sessions = await prisma.session.findMany({
      where: { 
        ...query,
        ...( partnerId ? { partnerId }: {} )
      
         },
      include: {
        partner: true 
      },   
      skip: startIndex,
      take: limit,
      orderBy: {
        ...orderBySearchRelevance,
      },
    });

    return { sessions, totalPages };
  });
