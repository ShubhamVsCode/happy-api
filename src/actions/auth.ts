"use server";

import prisma from "@/lib/db";
import { signOut } from "@/lib/auth";

export const getUser = async ({
  id,
  email,
}: {
  id?: string;
  email?: string;
}) => {
  try {
    if (id) {
      return await prisma.user.findFirst({
        where: {
          id,
        },
      });
    }

    if (email) {
      return await prisma.user.findUnique({
        where: {
          email,
        },
      });
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const logout = async () => {
  await signOut();
};
