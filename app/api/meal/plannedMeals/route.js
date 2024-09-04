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
    prepTime,
    datePlanned,
  } = await req.json();

  try {
    // 1. Récupérer les informations d'abonnement de l'utilisateur
    const userSubscription = await prisma.subscription.findUnique({
      where: { userId: userId },
    });

    // 2. Déterminer la limite en fonction de l'abonnement
    let maxMealsPerWeek = 2; // Par défaut pour les utilisateurs gratuits

    if (userSubscription && userSubscription.status === "ACTIVE") {
      if (userSubscription.planId === "66d74381dab92501fb416af9") {
        // Remplacez par votre ID d'abonnement premium réel
        maxMealsPerWeek = Infinity; // Pas de limite pour les utilisateurs premium
      }
    }

    // 3. Calculer les dates de début et de fin de la semaine en cours
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculer le lundi précédent
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOffset); // Lundi
    startOfWeek.setHours(0, 0, 0, 0); // Commencer à minuit

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Dimanche
    endOfWeek.setHours(23, 59, 59, 999); // Fin de la journée de dimanche

    // 4. Compter le nombre de repas planifiés pour cette semaine
    const mealsThisWeek = await prisma.plannedMeal.count({
      where: {
        userId: userId,
        plannedDate: {
          gte: startOfWeek, // Planifié après ou pendant le début de la semaine
          lte: endOfWeek, // Planifié avant ou pendant la fin de la semaine
        },
      },
    });

    // 5. Vérifier si l'utilisateur a atteint la limite (sauf pour les utilisateurs premium)
    if (mealsThisWeek >= maxMealsPerWeek) {
      return new Response(
        JSON.stringify({
          error:
            "Limite de repas atteinte pour cette semaine. Passez à la version premium pour planifier plus de repas.",
        }),
        { status: 403 }
      );
    }

    // 6. Si la limite n'est pas atteinte ou si l'utilisateur est premium, créer le nouveau repas planifié
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
        prepTime,
        datePlanned,
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
