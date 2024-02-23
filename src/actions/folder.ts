"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const createFolder = async ({
  name,
  description,
  collectionId,
}: {
  name: string;
  description?: string;
  collectionId: string;
}) => {
  const folder = await prisma.folder.create({
    data: {
      name,
      description,
      collectionId,
    },
    include: {
      requests: true,
    },
  });
  revalidatePath("/");

  return folder;
};
