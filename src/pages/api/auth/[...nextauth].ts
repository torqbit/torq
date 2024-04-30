import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import getUserByEmail from "@/actions/getUserByEmail";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_PUBLIC_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isActiveUser = user.isActive ?? true;
      console.log(user, "user details");

      const isEarlyAccess = await prisma.userJoinWaiting.findFirst({
        where: { email: user?.email as string },
      });
      console.log(`admin email : ${process.env.ADMIN_EMAIL}`);
      if (user.email == process.env.ADMIN_EMAIL) {
        console.log("matches admin mail");
        return true;
      }
      if (!isEarlyAccess) {
        return "/login?error=AccessDenied";
      }
      if (!isActiveUser) {
        return "/in-active-user";
      }
      return true;
    },

    async jwt({ token, account, user, profile }) {
      const dbUser = await getUserByEmail(token?.email as string);
      console.log(dbUser, "db user");
      let newRole = user?.role;
      if (user.email == process.env.ADMIN_EMAIL) {
        newRole = "AUTHOR";
      }
      if (!dbUser) {
        if (account) {
          token.accessToken = account.access_token;
          token.id = user?.id as number;
          token.role = newRole;
        }
        return token;
      }

      return {
        ...token,
        id: dbUser.id,
        role: dbUser.role,
        phone: dbUser.phone,
        isActive: dbUser.isActive,
        user: {
          name: dbUser.name,
          email: dbUser?.email,
          image: dbUser.image,
        },
      };
    },

    async session({ session, token }) {
      if (token) {
        session.id = token.id;
        session.role = token.role;
        session.phone = token.phone as string;
        session.isActive = token.isActive;
        session.user = token.user as Object;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
export default NextAuth(authOptions);
