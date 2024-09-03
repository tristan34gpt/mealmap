import Stripe from "stripe";

export const runtime = "edge"; // Utiliser 'edge' pour les fonctions edge

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
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
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Gérer les événements Stripe
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log(`Payment successful for session: ${session.id}`);
      // Logique pour mettre à jour la base de données ou envoyer un email
      break;

    case "invoice.payment_succeeded":
      const invoice = event.data.object;
      console.log(`Invoice payment succeeded: ${invoice.id}`);
      // Logique pour gérer le succès du paiement d'une facture
      break;

    // Ajoutez d'autres types d'événements que vous souhaitez gérer
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
