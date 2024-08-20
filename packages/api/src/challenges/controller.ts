import { TRPCError } from "@trpc/server";
import axios from "axios"; // Make sure to install axios
import { z } from "zod";

import { Prisma } from "@lumi/db";

import { protectedProcedure } from "../trpc";
import { createChallengeSchema } from "./schema";


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




