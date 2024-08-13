import { TRPCError } from "@trpc/server";
import axios from "axios"; // Make sure to install axios
import { z } from "zod";

import { Prisma } from "@lumi/db";

import { protectedProcedure } from "../trpc";
import {
  createChallengeSchema,
  joinChallengeSchema,
  listChallengeSchema,
  updateChallengeSchema,
} from "./schema";
import ChallengeService from "./service";

const challengeService = new ChallengeService();

export const createChallengesController = protectedProcedure
  .input(createChallengeSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const ownerId = ctx.user.id;
      let imageUrl = "";
      const { prisma } = ctx;

      try {
        // Make an HTTP call to the image generation API
        const response = await axios.post(
          "http://localhost:3000/api/generate-image",
          {
            name: input.name,
            description: input.description,
            activity: input.activities[0],
            userId: ctx.user.id,
          },
        );
        imageUrl = response.data; // Adjust this based on the API response structure
      } catch (imageError) {
        console.error("Failed to generate image:", imageError);
        // Use a fallback image URL if generation fails
        imageUrl =
          "https://xjhjbokiyhipxuumzpii.supabase.co/storage/v1/object/public/challenges/placeholder.png";
      }

      // const newChallenge = await challengeService.createChallenge(
      //   input,
      //   ownerId,
      //   imageUrl
      // );
      const { locationLat, locationLng, locationName, ...reset } = input;
      const newChallenge = prisma.challenge.create({
        data: {
          ...reset,
          imageUrl,
          capacity: parseInt(input?.capacity || "0", 10),
          visibility: input.visibility === "Public",
          location:
            locationLat && locationLng
              ? {
                  lat: locationLat,
                  lng: locationLng,
                  address: locationName,
                } as Prisma.JsonObject
              : null,
          owner: {
            connect: { id: ownerId },
          },
        },
      });

      return newChallenge;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to create challenge: ${error.message}`,
      });
    }
  });

export const listChallengesController = protectedProcedure
  .input(listChallengeSchema)
  .query(async ({ ctx, input }) => {
    try {
      console.log("backend called ==============");

      const { id, startDate, isUpcoming, hasJoined, activities, skip, limit } =
        input;
      const { prisma } = ctx;

      // Initialize the 'where' condition
      const where: Prisma.ChallengeWhereInput = {};

      if (startDate) {
        where.startDateTime = { gte: startDate };
      }
      // if (endDate) {
      //   where.endDateTime = { lte: endDate };
      // }
      if (activities && activities.length > 0) {
        where.activities = {
          hasSome: activities,
        };
      }
      if (id) {
        where.ownerId = id;
      }

      if (hasJoined) {
        where.members = {
          some: {
            AND: [
              {
                id: ctx.user.id,
              },
              {
                isDone: false,
              },
            ],
          },
        };
      }

      // // Define orderBy
      const orderBy = isUpcoming
        ? [{ startDateTime: "asc" }, { members: { _count: "desc" } }]
        : { startDateTime: "asc" };

      // // Define include
      // const include = { members: true };

      // // Define select if filtering upcoming challenges
      // const select = isUpcoming ? {
      //   members: {
      //     where: { profileId: id },
      //   },
      // } : undefined;
      console.log("reached");
      // Execute the query
      const challenges = await prisma.challenge.findMany({
        where,
        orderBy:
          orderBy as Prisma.ChallengeOrderByWithRelationAndSearchRelevanceInput,
      });

      console.log({ challenges }, "-------------from service---------");
      return challenges;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to list challenges: ${error.message}`,
      });
    }
  });

export const getChallengeController = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    try {
      const challenge = await challengeService.getChallengeById(input.id);
      if (!challenge) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Challenge not found.",
        });
      }
      return challenge;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to get challenge: ${error.message}`,
      });
    }
  });

export const updateChallengeController = protectedProcedure
  .input(updateChallengeSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      // Ensure that the user is allowed to update the challenge (e.g., by checking ownership)
      const updatedChallenge = await challengeService.updateChallenge(
        input.id,
        input,
      );
      return updatedChallenge;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to update challenge: ${error.message}`,
      });
    }
  });

export const deleteChallengeController = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    try {
      // Ensure that the user is allowed to delete the challenge (e.g., by checking ownership)
      const deletedChallenge = await challengeService.deleteChallenge(input.id);
      return deletedChallenge;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to delete challenge: ${error.message}`,
      });
    }
  });

export const joinChallengeController = protectedProcedure
  .input(joinChallengeSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const userId = ctx.user.id;
      await challengeService.joinChallenge(input.challengeId, userId);
      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to join challenge: ${error.message}`,
      });
    }
  });
