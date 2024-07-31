import { authOptions } from "@/lib/AuthOptions";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma"; // Utilisation de l'instance réutilisée

export async function POST(req) {
  let session;
  try {
    session = await getServerSession({ req, authOptions });
  } catch (error) {
    console.error("Error fetching session:", error);
    return new Response(JSON.stringify({ message: "Error fetching session" }), {
      status: 500,
    });
  }

  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }

  try {
    const { firstName, lastName, email } = await req.json();

    // Validation des entrées
    if (!firstName || !lastName || !email) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    // Vérifier si l'email est déjà pris
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return new Response(JSON.stringify({ message: "Email already taken" }), {
        status: 409,
      });
    }

    // Préparer les données à mettre à jour
    const updatedData = {
      firstName,
      lastName,
      email,
    };

    // Mettre à jour les informations de l'utilisateur dans la base de données
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: updatedData,
    });

    return new Response(
      JSON.stringify({
        message: "User updated successfully",
        user: updatedUser,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Error updating user" }), {
      status: 500,
    });
  }
}
