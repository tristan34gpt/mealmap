import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const meals = await prisma.meal.findMany({});
    return new Response(JSON.stringify(meals), { status: 200 });
  } catch (error) {
    console.error("Error fetching meals:", error);
    return new Response(JSON.stringify({ error: "Error fetching meals" }), {
      status: 500,
    });
  }
}
