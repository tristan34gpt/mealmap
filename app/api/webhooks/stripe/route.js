import { buffer } from "micro";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false, // Désactive l'analyse du corps pour utiliser "buffer"
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Webhook secret

export default async function handler(req, res) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
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

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
