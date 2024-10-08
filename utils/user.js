import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { sendConfirmationEmail } from "@/lib/email";

export async function createUserWithAccount({
  firstName,
  lastName,
  password,
  email,
}) {
  try {
    const freemiumPlan = await prisma.plan.findFirst({
      where: { name: "Plan freemium" },
    });
    console.log("Creating user with email:", email); // Log pour vérifier les données
    const hashedPassword = await bcrypt.hash(password, 10); // Hachage du mot de passe
    const newUser = await prisma.user.create({
      data: {
        firstName: firstName || null,
        lastName,
        email,
        password: hashedPassword,
        accounts: {
          create: {
            type: "credentials",
            provider: "email",
            providerAccountId: uuidv4(),
          },
        },
      },
      include: {
        accounts: true,
      },
    });

    await prisma.subscription.create({
      data: {
        userId: newUser.id,
        planId: freemiumPlan.id,
        status: "ACTIVE",
        startDate: new Date(),
      },
    });
    console.log("New user created:", newUser); // Log pour vérifier le nouvel utilisateur
    // Envoi de l'email de confirmation
    try {
      await sendConfirmationEmail(
        newUser.email,
        newUser.firstName || "Utilisateur"
      );
      console.log("Email de confirmation envoyé avec succès");
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'email de confirmation :",
        error
      );
    }
    return newUser; // Retourner le nouvel utilisateur
  } catch (error) {
    console.error("Error creating the user: ", error); // Afficher les erreurs
    throw error; // Propager l'erreur pour qu'elle soit gérée par l'appelant
  }
}
