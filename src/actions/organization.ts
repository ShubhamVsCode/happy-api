"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function createOrganization({
  name,
  description,
  createdById,
}: {
  name: string;
  description: string;
  createdById?: string;
}) {
  const alreadyCreatedOrganization = await prisma.organization.findUnique({
    where: {
      name,
    },
  });

  if (alreadyCreatedOrganization) {
    return "ALREADY_CREATED";
  }

  const organization = await prisma.organization.create({
    data: {
      name,
      description,
      createdById,
    },
  });

  const response = await joinOrganization({ organizationId: organization.id });

  return organization;
}

export async function joinOrganization({
  organizationId,
  orgName,
}: {
  organizationId?: string;
  orgName?: string;
}) {
  const session = await auth();

  if (session?.user.organizationId) {
    return "ALREADY_JOINED";
  }

  let orgId;

  if (!organizationId) {
    const org = await prisma.organization.findUnique({
      where: {
        name: orgName,
      },
    });

    orgId = org?.id;
  }

  const organization = await prisma.user.update({
    where: {
      id: session?.user?.id,
    },
    data: {
      organizationId: orgId || organizationId,
    },
  });

  return "JOIN_SUCCESS";
}

export async function getOrganization(name: string) {
  return await prisma.organization.findUnique({
    where: {
      name,
    },
  });
}
