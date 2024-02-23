import "next-auth";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { User } from "@prisma/client";
import authConfig from "./auth.config";
import { getUser } from "@/actions/auth";
import prisma from "./db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
  callbacks: {
    signIn: async (data) => {
      return true;
    },

    session: async ({ session, token }) => {
      session.user.id = token.sub ?? "";

      const user = await getUser({ id: session.user.id });

      if (user) session.user = user;

      return session;
    },

    jwt: async (data) => {
      return data.token;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: User;
  }
}
