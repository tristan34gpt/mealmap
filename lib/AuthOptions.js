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

        // Log the credentials
        console.log("Authorize called with credentials: ", email);

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // Log the result of the user query
        console.log("User found in database: ", user);

        if (!user) {
          console.error("No user found with the email:", email);
          return null;
        }

        // Compare the password with the hashed password stored in the database
        const passwordMatched = await bcrypt.compare(password, user.password);

        // Log the result of the password comparison
        console.log("Password match: ", passwordMatched);

        if (passwordMatched) {
          // Log the user info before returning it
          console.log("Returning user: ", {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image,
          });

          // Return the user object
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image,
          };
        } else {
          console.error("Password does not match for user:", email);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for the session
  },
  pages: {
    signIn: "/signin", // Custom sign-in page
  },
  secret: process.env.NEXTAUTH_SECRET, // Secret key for JWT signing
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback called - user:", user, "account:", account);

      if (account.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        console.log("Existing user found for Google sign-in: ", existingUser);

        if (existingUser) {
          const linkedAccount = await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          });

          if (!linkedAccount) {
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
          const freemiumPlan = await prisma.plan.findFirst({
            where: { name: "Plan freemium" },
          });

          if (!freemiumPlan) {
            console.error("Plan freemium not found in the database.");
            throw new Error("Freemium plan not found.");
          }

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
              subscriptions: {
                create: {
                  planId: freemiumPlan.id,
                  status: "ACTIVE",
                  startDate: new Date(),
                },
              },
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      console.log(
        "JWT Callback - token:",
        token,
        "user:",
        user,
        "account:",
        account
      );

      if (account?.type === "credentials" && user) {
        // Store user information in the token
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.image = user.image;

        console.log("Updated token with credentials provider:", token);
      }

      // For other providers like Google
      if (account) {
        token.provider = account.provider;
      }

      // Log the final token before returning it
      console.log("Final token:", token);

      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - token:", token, "session:", session);

      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.image = token.image;
        session.user.provider = token.provider;

        console.log("Updated session with token data:", session);
      }

      // Retrieve the user's subscription plan
      const userSubscription = await prisma.subscription.findFirst({
        where: { userId: token.id },
        include: {
          plan: true, // Include the plan details (e.g., plan name)
        },
      });

      session.user.plan = userSubscription
        ? userSubscription.plan.name
        : "Freemium";

      // Log the updated session
      console.log("Final session:", session);

      return session;
    },
  },
};

export default NextAuth(authOptions);
