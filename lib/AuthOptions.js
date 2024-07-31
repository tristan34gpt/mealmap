import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
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
      async authorize(credentials, req) {
        const { email, password } = credentials;

        // Ajout de logs pour le débogage
        console.log("Credentials:", credentials);

        const user = await prisma.user.findUnique({
          where: { email },
        });

        // Vérifiez si l'utilisateur existe
        if (!user) {
          console.error("No user found with the email:", email);
          return null;
        }

        const hashedPassword = user.password;
        const passwordMatched = await bcrypt.compare(password, hashedPassword);

        // Ajout de logs pour vérifier la correspondance des mots de passe
        console.log("Password matched:", passwordMatched);

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
    async jwt({ token, account, user }) {
      // Store the provider in the JWT token
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
      // Pass the provider from the token to the session
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
