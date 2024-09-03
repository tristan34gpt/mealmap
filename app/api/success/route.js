import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2024-04-10",
});

export const GET = async (request) => {
  try {
    const { searchParams } = new urlToUrlWithoutFlightMarker(request.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Erreur de token" }, { status: 400 });
    }
    const customer = await stripe.customer.retrieve(token);

    if (customer.deleted) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
      const customerData = customer;

      return NextResponse.json(
        { name: customerData.name, email },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la requete GET" },
      { satus: 500 }
    );
  }
};
