import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProfile = async (id: string, ctx) => {
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: {
      preference: true
    }
  });
  if (!profile) {
    // Create a new profile using the user data from context
    return await prisma.profile.create({
      data: {
        id: ctx.user.id,
        name:  "New User",
        email: ctx.user.email,
        image: ctx.user.user_metadata.avatar_url || "",
      },
    });
  }
  return profile;
};

export const updateProfile = async (
  id: string,
  data: { name?: string; image?: string; email?: string },
) => {
  return await prisma.profile.update({
    where: { id },
    data,
  });
};

export const deleteProfile = async (id: string) => {
  return await prisma.profile.delete({
    where: { id },
  });
};

export const createProfile = async (data: {
  id: string;
  name: string;
  image?: string;
  email: string;
}) => {
  return await prisma.profile.create({
    data,
  });
};
