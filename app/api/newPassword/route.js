import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return new Response(
      JSON.stringify({ message: "Token ou mot de passe manquant." }),
      {
        status: 400,
      }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user) {
      return new Response(
        JSON.stringify({
          message: "Utilisateur non trouvé ou token invalide.",
        }),
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { resetToken: token },
      data: {
        password: hashedPassword,
        resetToken: null, // On supprime le resetToken après réinitialisation
      },
    });

    return new Response(
      JSON.stringify({ message: "Mot de passe réinitialisé avec succès." }),
      {
        status: 200,
      }
    );
  } catch (e) {
    console.error("Erreur lors de la réinitialisation du mot de passe :", e);
    return new Response(JSON.stringify({ message: "Erreur serveur." }), {
      status: 500,
    });
  }
}
