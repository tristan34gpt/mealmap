import { createUserWithAccount } from "@/utils/user";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const POST = async (req) => {
  try {
    const { firstName, lastName, password, email } = await req.json();
    console.log("Received data:", { firstName, lastName, password, email }); // Log pour vérifier les données reçues

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email is already in use",
        },
        { status: 400 }
      );
    }

    const newUser = await createUserWithAccount({
      firstName,
      lastName,
      password,
      email,
    });
    return NextResponse.json(
      {
        message: "User created",
        data: newUser,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error during user creation: ", e);
    return NextResponse.json(
      {
        message: "Error",
        error: e.message,
      },
      { status: 500 }
    );
  }
};

export async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error("Error getting user by email: ", error);
    throw error;
  }
}
