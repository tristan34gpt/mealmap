import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// Fonction utilitaire pour générer un jeton sécurisé
const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export async function POST(request) {
  const { email } = await request.json();

  // Vérifier si l'utilisateur existe
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Utilisateur non trouvé" },
      { status: 404 }
    );
  }

  // Générer un nouveau jeton de réinitialisation s'il n'en existe pas déjà un
  const resetToken = generateToken();
  const resetTokenExpiry = new Date(Date.now() + 3600000); // Expiration dans 1 heure

  // Mettre à jour l'utilisateur avec le nouveau resetToken
  await prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  // Lien de réinitialisation
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}?token=${resetToken}`;

  // Envoi de l'email avec Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html: `<p>Bonjour,</p>
           <p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
           <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
           <p>Ce lien expire dans 1 heure.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Email envoyé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    return NextResponse.json(
      { message: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
