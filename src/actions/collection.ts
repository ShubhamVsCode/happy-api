"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const createCollection = async ({
  name,
  description,
  organizationId,
}: {
  name: string;
  description: string;
  organizationId?: string;
}) => {
  const collection = await prisma.collection.create({
    data: {
      name,
      description,
      organizationId,
    },
  });

  revalidatePath("/");
  return collection;
};

export const getOrganizationCollection = async () => {
  const session = await auth();

  const collection = await prisma.collection.findMany({
    where: {
      organizationId: session?.user?.organizationId,
    },
    include: {
      folders: {
        include: {
          requests: true,
        },
      },
      requests: true,
    },
  });
  return collection;
};
