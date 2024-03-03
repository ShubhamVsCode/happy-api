"use server";

import prisma from "@/lib/db";
import { Variable } from "@prisma/client";

export const createVariable = async (data: Omit<Variable, "id">) => {
  const variable = await prisma.variable.create({
    data,
  });

  return variable;
};

export const updateVariable = async (data: Variable) => {
  const id = data.id;
  delete data.id;

  const variable = await prisma.variable.update({
    where: {
      id,
    },
    data,
  });

  return variable;
};

export const getAllVariablesOfOrganization = async (organizationId: string) => {
  const variables = await prisma.variable.findMany({
    where: {
      organizationId,
    },
  });

  return variables;
};
