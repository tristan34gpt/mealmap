import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2024-04-10",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req) {
  const buf = await buffer(req.body);
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = await stripe.webhooks.constructEventAsync(buf, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Gérer les événements Stripe
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const userEmail = session.metadata.user_email; // Récupérer l'email de l'utilisateur

      // Récupérer les line items de la session
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );
      const productName = lineItems.data[0]?.description; // Le nom du produit se trouve dans la description

      if (!productName) {
        console.error("Product name not found");
        return new Response(`Product name not found`, { status: 400 });
      }

      // Ajouter la logique pour créer un abonnement dans la base de données
      try {
        // Récupérer l'utilisateur basé sur l'email du client Stripe
        const user = await prisma.user.findUnique({
          where: { email: userEmail },
        });

        const plan = await prisma.plan.findFirst({
          where: { name: productName }, // Utiliser le nom du produit pour trouver le plan
        });

        if (!plan) {
          throw new Error("Plan not found");
        }

        if (user) {
          // Créer l'abonnement dans la base de données
          await prisma.subscription.create({
            data: {
              userId: user.id,
              planId: plan.id, // Utilisez l'ID du plan trouvé
              status: "ACTIVE",
              startDate: new Date(),
            },
          });

          console.log(`Subscription added for user: ${user.email}`);
        } else {
          console.error(`User not found for email: ${userEmail}`);
        }
      } catch (error) {
        console.error(`Failed to create subscription: ${error.message}`);
      }
      break;

    case "invoice.payment_succeeded":
      const invoice = event.data.object;
      console.log(`Invoice payment succeeded: ${invoice.id}`);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
