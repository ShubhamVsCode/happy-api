"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const createNewRequest = async ({
  name,
  collectionId,
  folderId,
}: {
  name: string;
  collectionId: string;
  folderId?: string;
}) => {
  const request = await prisma.request.create({
    data: {
      name,
      collectionId,
      folderId,
    },
  });

  revalidatePath("/");
  return request;
};

export const updateRequest = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const request = await prisma.request.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  revalidatePath("/");
  return request;
};
