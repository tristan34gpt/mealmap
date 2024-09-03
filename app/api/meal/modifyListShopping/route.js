import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userId, id, date } = await req.json();

    console.log("Received data:", { userId, id });

    // Find the finished purchases that match the criteria
    const shoppingFinished = await prisma.finishedPurchase.findMany({
      where: {
        userId: userId,
        id: id,
        date: new Date(date),
      },
    });

    // Extract the IDs of the found purchases
    const idsToDelete = shoppingFinished.map((purchase) => purchase.id);

    if (idsToDelete.length > 0) {
      // Delete the found purchases
      await prisma.finishedPurchase.deleteMany({
        where: {
          id: {
            in: idsToDelete,
          },
        },
      });
      console.log("Successfully deleted finished purchases:", idsToDelete);
    } else {
      console.log("No finished purchases found to delete.");
    }

    return new Response(JSON.stringify({ message: "Deletion completed" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting finished purchases:", error);
    return new Response(
      JSON.stringify({ error: "Error deleting finished purchases" }),
      { status: 500 }
    );
  }
}
