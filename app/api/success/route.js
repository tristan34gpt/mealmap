import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2024-04-10",
});

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Erreur de token" }, { status: 400 });
    }

    const customer = await stripe.customers.retrieve(token); // Correct API method for retrieving customers

    if (customer.deleted) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const customerData = customer;

    return NextResponse.json(
      { name: customerData.name, email: customerData.email },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la requête GET" },
      { status: 500 } // Fixed typo in "status"
    );
  }
};
