import { protectedProcedure, publicProcedure } from "../trpc";
import * as Schema from "./schema";
import * as Service from "./service";

export const getUserController = publicProcedure.query(({ ctx }) => {

  return Service.getProfile(ctx.user?.id as string, ctx);
});

export const updateUserController = protectedProcedure
  .input(Schema.updateProfileSchema)
  .mutation(({ ctx, input }) => {
    return Service.updateProfile(input.id, { ...input });
  });

export const deleteUserController = protectedProcedure
  .input(Schema.deleteProfileSchema)
  .mutation(({ ctx }) => {
    return Service.deleteProfile(ctx.user.id);
  });

export const createUserController = protectedProcedure
  .input(Schema.updateProfileSchema)
  .mutation(({ ctx, input }) => {
    return Service.createProfile({ ...input });
  });
