import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma"; // Adjust the import path as needed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        // Verify if the user exists and check password
        if (!user) {
          console.error("No user found with the email:", email);
          return null;
        }

        const passwordMatched = await bcrypt.compare(password, user.password);

        if (passwordMatched) {
          return user;
        } else {
          console.error("Password does not match for user:", email);
          return null;
        }
      },
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
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          // Check if the Google account is already linked
          const linkedAccount = await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          });

          if (!linkedAccount) {
            // Link the Google account to the existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                type: account.type,
                access_token: account.access_token,
                expires_at: account.expires_at,
                id_token: account.id_token,
                refresh_token: account.refresh_token,
              },
            });
          }
        } else {
          // Create a new user if no existing user is found
          await prisma.user.create({
            data: {
              email: user.email,
              firstName: profile.given_name || null,
              lastName: profile.family_name || null,
              image: profile.picture,
              accounts: {
                create: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  type: account.type,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  id_token: account.id_token,
                  refresh_token: account.refresh_token,
                },
              },
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, account, user }) {
      // Store provider in the JWT token
      if (account) {
        token.provider = account.provider;
      }
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass provider from token to session
      if (token.provider) {
        session.user.provider = token.provider;
      }
      session.user.id = token.id;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.image = token.image;
      return session;
    },
  },
};

export default NextAuth(authOptions);
