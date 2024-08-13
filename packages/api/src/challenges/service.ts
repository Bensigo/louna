import type { Challenge } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { createChallengeSchema, listChallengeSchema } from "./schema";
import { z } from "zod";
import { Prisma } from "@lumi/db";

const prisma = new PrismaClient();

interface ChallengeData {
  name: string;
  description: string;
  capacity?: number;
  visibility: "Public" | "Private";
  startDateTime: Date;
  endDateTime?: Date;
  locationName?: string;
  locationLat?: number;
  locationLng?: number;
  activities: [];
}

class ChallengeService {
  // Create a new challenge
  async createChallenge(
    data: ChallengeData,
    ownerId: string,
    imageUrl: string
  ): Promise<Challenge> {
    const validatedData = createChallengeSchema.parse(data);

    const { locationLat, locationLng, locationName,  ...reset  } = validatedData

    return await prisma.challenge.create({
      data: {
        ...reset,
        imageUrl,
        capacity: parseInt(validatedData?.capacity || "0", 10),
        visibility: validatedData.visibility === "Public",
        location: validatedData.locationLat && validatedData.locationLng
          ? JSON.stringify({
              lat: locationLat,
              lng: locationLng,
              address: locationName,
            })
          : null,
        owner: {
          connect: { id: ownerId }
        },
      },
    });
  }

  // List challenges with optional filters
  async listChallenges(
    filter: z.infer<typeof listChallengeSchema>,
    skip: number = 0,
    limit: number = 50,
  ): Promise<Challenge[]> {
    // Validate filter and parameters
    const validatedFilter = listChallengeSchema.parse({ filter, skip, limit });
    console.log({ validatedFilter })
    // Determine ordering based on filter
    const orderBy = validatedFilter.isUpcoming
      ? [{ startDateTime: "asc" }] // Order upcoming challenges by start date
      : [{ members: { _count: "desc" } }]; // Order by number of members

    // Initialize the query object
    let query: any = {
      skip: validatedFilter.skip,
      take: validatedFilter.limit,
      orderBy,
      include: {
        members: true, // Include members in the result
      },
    };

    // Populate the 'where' condition based on filter
    query.where = {};

    if (validatedFilter.startDate) {
      query.where.startDateTime = {
        gte: validatedFilter.startDate,
      };
    }

    if (validatedFilter.endDate) {
      query.where.endDateTime = {
        lte: validatedFilter.endDate,
      };
    }

    if (validatedFilter.activities) {
      query.where.activities = {
        in: validatedFilter.activities,
      };
    }

    if (validatedFilter.id) {
      query.where.ownerId = validatedFilter.id;
    }

    // Add additional selection if filtering upcoming challenges
    if (validatedFilter.isUpcoming) {
      query.select = {
        members: {
          where: {
            profileId: validatedFilter.id,
          },
        },
      };
    }

    console.log({ query })
  
    const challenges = await prisma.challenge.findMany(query)

    // Execute the query
    console.log({ challenges }, '-------------from service---------')
    return challenges;
  }

  // Get a single challenge by ID
  async getChallengeById(id: string): Promise<Challenge | null> {
    return await prisma.challenge.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });
  }

  // Update an existing challenge
  async updateChallenge(
    id: string,
    data: Partial<ChallengeData>,
  ): Promise<Challenge> {
    const { startDateTime, endDateTime , locationLat, locationName, locationLng} = createChallengeSchema.partial().parse(data);

    return await prisma.challenge.update({
      where: { id },
      data: {
        ...(startDateTime? { startDateTime }: {} ),
        ...(endDateTime? { endDateTime }: {} ),
        ...( locationLat && locationLng ? { location: JSON.stringify({
          lat: locationLat,
          lng: locationLng,
          address: locationName,
        })} as Prisma.JsonObject: {}) 
    }});
  }

  // Delete a challenge by ID
  async deleteChallenge(id: string): Promise<Challenge> {
    return await prisma.challenge.delete({
      where: { id},
    });
  }

  // Join a challenge (handle double joining issue with transaction)
  async joinChallenge(challengeId: string, userId: string): Promise<void> {
    const existingMembership = await prisma.challenge.findFirst({
      where: {
        id: challengeId,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                profileId: userId
              }
            }
          }
        ]
      }
    });

    if (existingMembership) {
      throw new TRPCError({
        message: "User is already a member of this challenge.",
        code: "BAD_REQUEST",
      });
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new TRPCError({
        message: "Challenge not found.",
        code: "BAD_REQUEST",
      });
    }

    if (challenge.capacity <= 0) {
      throw new TRPCError({
        message: "Challenge is full.",
        code: "BAD_REQUEST",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.challengeMembers.create({
        data: {
          challengeId,
          userId,
        },
      });

      await tx.challenge.update({
        where: { id: challengeId },
        data: {
          capacity: challenge.capacity - 1,
        },
      });
    });
  }
}

export default ChallengeService;