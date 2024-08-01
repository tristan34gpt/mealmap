import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Store the provider in the JWT token
      if (account) {
        token.provider = account.provider;
      }

      // Map Google profile fields to your User model
      if (profile) {
        token.firstName =
          profile.given_name || user?.name?.split(" ")[0] || null;
        token.lastName =
          profile.family_name || user?.name?.split(" ")[1] || null;
        token.image = profile.picture || user?.image || null;
      }

      // If a new user was created (from Google login)
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the provider and other info from the token to the session
      session.user.provider = token.provider;
      session.user.id = token.id;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.image = token.image;
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("Profile received from Google:", profile);
      // Optional: Handle user creation here if needed
      return true;
    },
  },
};

export default NextAuth(authOptions);
