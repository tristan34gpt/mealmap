import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getToken } from "next-auth/jwt"; // Utilisez getToken pour récupérer les informations d'authentification
import prisma from "@/lib/prisma"; // Assurez-vous que ceci pointe vers votre instance Prisma

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2022-11-15",
});

export const POST = async (request) => {
  try {
    // Utiliser getToken pour récupérer le token JWT de l'utilisateur
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Récupérer l'utilisateur depuis la base de données via Prisma
    const user = await prisma.user.findUnique({
      where: { email: token.email }, // Utiliser l'email du token pour trouver l'utilisateur
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer les données de la requête
    const data = await request.json();
    console.log("Données reçues :", data);

    // Créer un client Stripe
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      address: {
        city: "Los Angeles",
        country: "US",
        postal_code: "00000",
        line1: "rue de la paix",
        state: "CA",
      },
    });

    // Calculer le montant en centimes
    const amountInCents = Math.round(data.price * 100);

    if (amountInCents < 50) {
      throw new Error("Le prix doit être supérieur à 50 centimes");
    }

    // Créer une session de paiement Stripe pour un abonnement
    const checkOutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      customer_email: user.email,
      mode: "subscription",
      success_url: `https://localhost:3000/success?token=${customer.id}`,
      cancel_url: `https://localhost:3000/cancel?token=${customer.id}`,
      line_items: [
        {
          price_data: {
            currency: "EUR",
            product_data: {
              name: data.title,
            },
            unit_amount: amountInCents,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
    });

    console.log("Session de paiement créée :", checkOutSession.url);
    return NextResponse.json(
      { msg: "Session créée avec succès", url: checkOutSession.url },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la création de la session de paiement : ",
      error
    );
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
