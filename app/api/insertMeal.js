const { MongoClient } = require("mongodb");

async function main() {
  const uri =
    "mongodb+srv://tristanvera19:emiliano789@cluster0.rvu6yzx.mongodb.net/mealapp?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const database = client.db("mealapp");
    const meals = database.collection("Meal");

    const newMeal = {
      title: "Salade de Poulet César",
      description:
        "Une délicieuse salade de poulet César avec une sauce crémeuse.",
      recipe:
        "1. Griller le poulet et le couper en tranches.\n2. Mélanger la laitue, les croûtons et le parmesan.\n3. Ajouter le poulet et la sauce César.\n4. Mélanger le tout et servir frais.",
      ingredients: [
        {
          name: "Poulet",
          quantity: 200,
          unit: "g",
        },
        {
          name: "Laitue romaine",
          quantity: 100,
          unit: "g",
        },
        {
          name: "Croûtons",
          quantity: 50,
          unit: "g",
        },
        {
          name: "Parmesan râpé",
          quantity: 30,
          unit: "g",
        },
        {
          name: "Sauce César",
          quantity: 50,
          unit: "ml",
        },
      ],
      macronutrients: {
        protein: 30,
        carbs: 20,
        fats: 15,
        calories: 350,
      },
      prepTime: "15 minutes",
      image: "https://example.com/images/salade-de-poulet-cesar.jpg",
      tags: ["salad", "chicken", "healthy"],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await meals.insertOne(newMeal);
    console.log(
      `New meal inserted with the following id: ${result.insertedId}`
    );
  } finally {
    await client.close();
  }
}

main().catch(console.error);
