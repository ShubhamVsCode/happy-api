"use server";

import prisma from "@/lib/db";
import { Request } from "@prisma/client";
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

export const updateRequest = async (data: Request) => {
  const id = data.id;
  delete data.id;

  const request = await prisma.request.update({
    where: {
      id,
    },
    data,
  });

  revalidatePath("/");
  return request;
};

export const deleteRequest = async (id: string) => {
  const request = await prisma.request.delete({
    where: { id },
  });

  revalidatePath("/");
  return request;
};
