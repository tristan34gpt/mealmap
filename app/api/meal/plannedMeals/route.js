import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const {
    userId,
    mealId,
    mealName,
    mealImage,
    plannedDate,
    ingredients,
    number,
    recipe,
    description,
    macronutrients,
  } = await req.json();

  try {
    const plannedMeal = await prisma.plannedMeal.create({
      data: {
        userId,

        mealId,
        mealName,
        mealImage,
        plannedDate: new Date(plannedDate),
        ingredients,
        recipe,
        description,
        number,
        macronutrients,
      },
    });
    return new Response(JSON.stringify(plannedMeal), { status: 200 });
  } catch (error) {
    console.error("Error creating planned meal:", error);
    return new Response(
      JSON.stringify({ error: "Error creating planned meal" }),
      { status: 500 }
    );
  }
}
