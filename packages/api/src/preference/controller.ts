
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../trpc";
import { CreateProfileSchema, UpdatePrefSchema, GetProfileSchema } from "./schema";
import PreferenceService from "./service";

const preferenceService = new PreferenceService();

export const createController = protectedProcedure
.input(CreateProfileSchema)
.mutation(async ({ input, ctx }) => {
  try {
    const userId = ctx.user.id;
    const preference = await preferenceService.cretate(userId, input);
    return preference;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create preference",
    });
  }
})

export const updateController = protectedProcedure
.input(UpdatePrefSchema)
.mutation(async ({ input, ctx }) => {
  try {
    const userId = ctx.user.id;
    const updatedPreference = await preferenceService.update(userId, input);
    return updatedPreference;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update preference",
    });
  }
})


export const getController = protectedProcedure
.input(GetProfileSchema)
.query(async ({ input }) => {
  try {
    const preference = await preferenceService.get(input.userId);
    return preference;
  } catch (error) {
    if (error instanceof Error && error.message === 'Preference not found') {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Preference not found",
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get preference",
    });
  }
})
