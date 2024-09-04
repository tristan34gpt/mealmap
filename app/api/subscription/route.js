import prisma from "@/lib/prisma"; // Utilisation de l'instance réutilisée

export async function POST(req) {
  try {
    // Parse the request body to get the user ID
    const { userId } = await req.json();

    if (!userId) {
      // Return a response with a 401 status if the user is not authenticated
      return new Response(JSON.stringify({ message: "Not authenticated" }), {
        status: 401,
      });
    }

    console.log("Received data:", { userId });

    // Find the subscription  for the given user ID
    const subscription = await prisma.subscription.findMany({
      where: {
        userId: userId,
      },
    });

    // Return the found data as a JSON response
    return new Response(JSON.stringify({ subscription }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching subscription :", error);

    // Return a response with a 500 status if there's an error
    return new Response(
      JSON.stringify({ error: "Error fetching subscription " }),
      { status: 500 }
    );
  }
}
