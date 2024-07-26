import { authOptions } from "@/lib/AuthOptions";
import { getServerSession } from "next-auth";

import prisma from "@/lib/prisma"; // Utilisation de l'instance réutilisée

export async function GET(req) {
  let session;
  try {
    session = await getServerSession({ req, authOptions });
  } catch (error) {
    console.error("Error fetching session:", error);
    return new Response(JSON.stringify({ message: "Error fetching session" }), {
      status: 500,
    });
  }

  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }

  try {
    const plannedMeals = await prisma.plannedMeal.findMany({
      where: {
        userId: session.user.id,
      },
    });
    return new Response(JSON.stringify({ plannedMeals }), { status: 200 });
  } catch (error) {
    console.error("Error fetching planned meals:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching planned meals" }),
      { status: 500 }
    );
  }
}
