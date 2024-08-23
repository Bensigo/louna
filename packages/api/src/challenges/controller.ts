import { TRPCError } from "@trpc/server";
import axios from "axios"; // Make sure to install axios
import { z } from "zod";


import { protectedProcedure } from "../trpc";
import { createChallengeSchema, deleteChallengeSchema, generateImageSchema, getChallengeSchema, listChallengesSchema, updateChallengeSchema } from "./schema";


export const createChallengeController = protectedProcedure.input(createChallengeSchema).mutation(async ({ ctx, input}) => {
  const userId = ctx.user.id

    try {
      // Validate input using the schema
      const validatedData = createChallengeSchema.parse(input);

      // Create a transaction for challenge creation and participant addition
      await ctx.prisma.$transaction(async (tx) => {
        const challenge = await tx.challenge.create({
          data: {
            ...validatedData,
            creatorId: userId,
          },
        });
        await tx.challengeParticipation.create({
          data: {
            userId: userId,
            challengeId: challenge.id,
          },
        })
      });

      return {
        status: 201,
        message: "Challenge created successfully",
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Validation error: ${error.message}`,
        });
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to create challenge: ${error.message}`,
      });
    }
})


export const listChallengeController = protectedProcedure.input(listChallengesSchema).query(async ({ ctx, input }) => {
  const { isFreeSession, isJoined, type, page, limit } = input;

  let query = {}

  if (isFreeSession){
    query = { ...query, isFreeSession }
  }

  if (isJoined){
    query = {
      ...query,
      participants: {
        some: {
          AND: {
            userId: ctx.user.id
          }
        }
      }
    }
  }

  if (type){
    query = {
      ...query,
      type
    }
  }

  const offset = (page - 1) * limit;

  const challenges = await ctx.prisma.challenge.findMany({
    where: {
      ...query,
      startDate: {
        gte: new Date(),
      }
    },
    take: limit,
    skip: offset,
    include: {
      participants: {
        include: {
          user: true
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalChallenges = await ctx.prisma.challenge.count({
    where: {
      ...query,
    },
  });

  const totalPages = Math.ceil(totalChallenges / limit);

  return {
    challenges,
    totalPages,
    currentPage: page,
  };
})


export const getChallengeController = protectedProcedure.input(getChallengeSchema).query(async ({ ctx, input }) => {
  const { id } = input;

    const challenge = await ctx.prisma.challenge.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: true
          },
        },
        creator: true,
      },
    });

    if (!challenge) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Challenge not found" });
    }

    return challenge;
})


export const deleteChallengeController = protectedProcedure.input(deleteChallengeSchema).mutation(async ({ ctx, input }) => {
  const { id } = input;

  const challenge = await ctx.prisma.challenge.findFirst({
    where: {
      id,
      creatorId: ctx.user.id,
    },
  });

  if (!challenge) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Challenge not found" });
  }

  return await ctx.prisma.challenge.delete({
    where: { id },
  });
})

export const updateChallengeController = protectedProcedure
  .input(updateChallengeSchema)
  .mutation(async ({ ctx, input }) => {
    const { id, title, type, startDate, endDate, goalType, goalValue, description, isFreeSession, interval } = input;

    // Ensure the user is the creator of the challenge
    const challenge = await ctx.prisma.challenge.findFirst({
      where: {
        id,
        creatorId: ctx.user.id,  // Validate that the current user is the creator
      },
    });

    if (!challenge) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Challenge not found or you do not have permission to update it." });
    }

    // Update the challenge with the new data
    return await ctx.prisma.challenge.update({
      where: { id },
      data: {
        title,
        type,
        interval,
        startDate,
        endDate,
        goalType,
        goalValue,
        description,
        isFreeSession
      },
    });
  });



export const joinChallengeController = protectedProcedure.input(getChallengeSchema).mutation(async ({ ctx, input }) => {
  const { id } = input;

  const challenge = await ctx.prisma.challenge.findUnique({
    where: { id },
    include: { participants: true },
  });

  if (!challenge) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Challenge not found" });
  }

  const alreadyJoined = challenge.participants.some(participant => participant.userId === ctx.user.id);

  if (alreadyJoined) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "User already joined this challenge" });
  }

  return await ctx.prisma.challenge.update({
    where: { id },
    data: {
      participants: {
        create: {
          userId: ctx.user.id,
        },
      },
    },
  });
})


export const generateImageController = protectedProcedure.input(generateImageSchema).mutation(async ({ input, ctx }) => {
  try {
    // Make an HTTP call to the image generation API
    const response = await axios.post(
      "https://louna.vercel.app/api/generate-image",
      {
        name: input.name,
        userId: ctx.user.id,
      },
    );
    const imageUrl = await response.data; // Adjust this based on the API response structure
   console.log({ imageUrl })
    if (imageUrl){
        await ctx.prisma.challenge.updateMany({
          where: {
            tempId: input.tempId,
            creatorId: ctx.user.id,
          },
          data: {
            imageUrl
          }
        })
    }
  } catch (imageError) {
    console.error("Failed to generate image:", imageError);
    // Use a fallback image URL if generation fails
    throw new TRPCError('Unable to upadte image')
 
  }
})



export const getCurrentActiveGoalsController = protectedProcedure.query(async ({ ctx }) => {
  const userId = ctx.user.id;
  const currentDate = new Date();


  const activeGoals = await ctx.prisma.challenge.findMany({
    where: {
      isDone: false,
      participants: {
        some: {
          userId: userId,
          isDone: false, // Challenge not completed by the user
        },
      },
      startDate: { lte: currentDate }, // Challenge has started
      endDate: { gte: currentDate }, // Challenge has not ended
    },
    include: {
      participants: {
        where: {
          userId: userId,
        },
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      endDate: 'asc', // Sort by end date, showing the ones ending soonest first
    },
  });

  const goals = activeGoals.map((challenge) => {
    return {
      id: challenge.id,
      goalType: challenge.goalType,
      value: challenge.goalValue,
      title: challenge.title,
      startDate: challenge.startDate,
      endDate: challenge.endDate
    }
  })
  // get the goal and 

  return goals;

})

