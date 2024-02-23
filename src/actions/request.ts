"use server";

import prisma from "@/lib/db";

export const createNewRequest = async ({
  name,
  collectionId,
  folderId,
}: {
  name: string;
  collectionId: string;
  folderId?: string;
}) => {
  return await prisma.request.create({
    data: {
      name,
      collectionId,
      folderId,
    },
  });
};
