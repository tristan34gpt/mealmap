import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userId, date, ingredient } = await req.json();

    console.log("Received data:", { userId, date, ingredient });

    // Ensure 'ingredient' is wrapped in an array, as the schema expects an array of Ingredient
    const shoppingFinished = await prisma.finishedPurchase.create({
      data: {
        userId,
        date: new Date(date), // Convert to Date object
        ingredients: [ingredient], // Make sure this is an array
      },
    });
    console.log("Successfully created finished purchase:", shoppingFinished);
    return new Response(JSON.stringify(shoppingFinished), { status: 200 });
  } catch (error) {
    console.error("Error creating finished purchase:", error);
    return new Response(
      JSON.stringify({ error: "Error creating finished purchase" }),
      { status: 500 }
    );
  }
}
