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
    // Rechercher l'utilisateur par le resetToken
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

    // Récupérer tous les comptes associés à cet utilisateur
    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
    });

    if (accounts.length === 0) {
      console.log("Aucun compte trouvé pour cet utilisateur.");
      return new Response(JSON.stringify({ message: "Aucun compte trouvé." }), {
        status: 400,
      });
    }

    // Vérifier s'il existe un compte avec credentials
    const credentialsAccount = accounts.find(
      (account) => account.type === "credentials"
    );

    if (!credentialsAccount) {
      console.log("Aucun compte de type 'credentials' trouvé.");
      return new Response(
        JSON.stringify({
          message:
            "Cet utilisateur ne peut pas réinitialiser le mot de passe car il utilise OAuth.",
        }),
        {
          status: 400,
        }
      );
    }

    // Si l'utilisateur a un compte credentials, réinitialiser le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { resetToken: token },
      data: {
        password: hashedPassword,
        resetToken: null, // Supprimer le resetToken après réinitialisation
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
