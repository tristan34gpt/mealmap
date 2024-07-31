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

    const newMeals = [
      // Repas
      {
        title: "Poulet à la Provençale",
        description:
          "Poulet mijoté avec des tomates, des herbes de Provence et des olives.",
        recipe:
          "1. Faire revenir le poulet dans une cocotte.\n2. Ajouter les tomates, les herbes et les olives.\n3. Laisser mijoter 30 minutes.\n4. Servir chaud.",
        ingredients: [
          { name: "Poulet", quantity: 500, unit: "g" },
          { name: "Tomates", quantity: 300, unit: "g" },
          { name: "Olives noires", quantity: 100, unit: "g" },
          { name: "Herbes de Provence", quantity: 10, unit: "g" },
        ],
        macronutrients: { protein: 40, carbs: 10, fats: 20, calories: 450 },
        prepTime: "45 minutes",
        image: "https://i.postimg.cc/L4V6ktyn/Poulet-la-Proven-ale.webp",
        tags: ["chicken", "french", "dinner"],
        type: "repas",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Risotto aux Champignons",
        description: "Risotto crémeux aux champignons et parmesan.",
        recipe:
          "1. Faire revenir les champignons.\n2. Ajouter le riz et du bouillon.\n3. Cuire en ajoutant du bouillon progressivement.\n4. Ajouter du parmesan et servir.",
        ingredients: [
          { name: "Champignons", quantity: 200, unit: "g" },
          { name: "Riz Arborio", quantity: 200, unit: "g" },
          { name: "Bouillon de légumes", quantity: 500, unit: "ml" },
          { name: "Parmesan", quantity: 50, unit: "g" },
        ],
        macronutrients: { protein: 12, carbs: 80, fats: 18, calories: 500 },
        prepTime: "40 minutes",
        image: "https://i.postimg.cc/c4HZQVgb/risoto-au-champignions.webp",
        tags: ["risotto", "mushroom", "italian"],
        type: "repas",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Curry de Légumes",
        description:
          "Curry végétarien avec des légumes de saison et du lait de coco.",
        recipe:
          "1. Faire revenir les légumes.\n2. Ajouter le curry et le lait de coco.\n3. Laisser mijoter 20 minutes.\n4. Servir avec du riz.",
        ingredients: [
          { name: "Légumes variés", quantity: 400, unit: "g" },
          { name: "Lait de coco", quantity: 200, unit: "ml" },
          { name: "Curry en poudre", quantity: 15, unit: "g" },
          { name: "Riz", quantity: 200, unit: "g" },
        ],
        macronutrients: { protein: 10, carbs: 60, fats: 15, calories: 400 },
        prepTime: "30 minutes",
        image: "https://i.postimg.cc/h4McQSjm/Curry-de-L-gumes.webp",
        tags: ["vegetarian", "curry", "spicy"],
        type: "repas",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Tacos au Bœuf",
        description: "Tacos épicés au bœuf avec du guacamole et des légumes.",
        recipe:
          "1. Cuire le bœuf avec les épices.\n2. Préparer le guacamole.\n3. Assembler les tacos avec le bœuf, le guacamole et les légumes.\n4. Servir immédiatement.",
        ingredients: [
          { name: "Bœuf haché", quantity: 300, unit: "g" },
          { name: "Épices pour tacos", quantity: 20, unit: "g" },
          { name: "Avocat", quantity: 100, unit: "g" },
          { name: "Tortillas", quantity: 4, unit: "pcs" },
          { name: "Légumes variés", quantity: 100, unit: "g" },
        ],
        macronutrients: { protein: 25, carbs: 45, fats: 20, calories: 600 },
        prepTime: "25 minutes",
        image: "https://i.postimg.cc/j28bph9c/Tacos-au-B-uf.webp",
        tags: ["tacos", "beef", "mexican"],
        type: "repas",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Saumon Teriyaki",
        description:
          "Saumon glacé à la sauce teriyaki, servi avec du riz et des légumes.",
        recipe:
          "1. Cuire le saumon et le glacer avec la sauce teriyaki.\n2. Préparer le riz et les légumes.\n3. Servir le saumon avec le riz et les légumes.",
        ingredients: [
          { name: "Saumon", quantity: 200, unit: "g" },
          { name: "Sauce teriyaki", quantity: 50, unit: "ml" },
          { name: "Riz", quantity: 200, unit: "g" },
          { name: "Légumes variés", quantity: 150, unit: "g" },
        ],
        macronutrients: { protein: 30, carbs: 60, fats: 15, calories: 500 },
        prepTime: "30 minutes",
        image: "https://i.postimg.cc/DZPFghPt/Saumon-Teriyaki.webp",
        tags: ["salmon", "teriyaki", "japanese"],
        type: "repas",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Déjeuner
      {
        title: "Smoothie aux Baies",
        description: "Smoothie rafraîchissant aux baies et au yaourt.",
        recipe:
          "1. Mélanger les baies et le yaourt dans un mixeur.\n2. Ajouter du miel selon votre goût.\n3. Mixer jusqu'à consistance lisse.\n4. Servir frais.",
        ingredients: [
          { name: "Baies mélangées", quantity: 200, unit: "g" },
          { name: "Yaourt", quantity: 150, unit: "g" },
          { name: "Miel", quantity: 20, unit: "g" },
        ],
        macronutrients: { protein: 10, carbs: 40, fats: 5, calories: 250 },
        prepTime: "10 minutes",
        image: "https://i.postimg.cc/LXp2L5Lt/Smoothie-aux-Baies.webp",
        tags: ["smoothie", "berries", "breakfast"],
        type: "déjeuner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Toast à l'Avocat",
        description:
          "Toast croustillant avec une purée d'avocat et des graines de sésame.",
        recipe:
          "1. Griller le pain.\n2. Écraser l'avocat et l'étaler sur le toast.\n3. Saupoudrer de graines de sésame et servir.",
        ingredients: [
          { name: "Pain complet", quantity: 2, unit: "tranches" },
          { name: "Avocat", quantity: 1, unit: "pc" },
          { name: "Graines de sésame", quantity: 10, unit: "g" },
        ],
        macronutrients: { protein: 6, carbs: 30, fats: 20, calories: 350 },
        prepTime: "10 minutes",
        image: "https://i.postimg.cc/Gt3RgfM9/Toast-l-Avocat.webp",
        tags: ["toast", "avocado", "breakfast"],
        type: "déjeuner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Granola Maison",
        description:
          "Granola croustillant avec des noix, des graines et du miel.",
        recipe:
          "1. Mélanger les flocons d'avoine, les noix et les graines.\n2. Ajouter le miel et bien mélanger.\n3. Cuire au four à 180°C pendant 20 minutes.\n4. Laisser refroidir et servir avec du yaourt.",
        ingredients: [
          { name: "Flocons d'avoine", quantity: 200, unit: "g" },
          { name: "Noix mélangées", quantity: 100, unit: "g" },
          { name: "Graines mélangées", quantity: 50, unit: "g" },
          { name: "Miel", quantity: 50, unit: "g" },
        ],
        macronutrients: { protein: 12, carbs: 60, fats: 20, calories: 450 },
        prepTime: "30 minutes",
        image: "https://i.postimg.cc/d0dJhrkQ/Granola-Maison.webp",
        tags: ["granola", "breakfast", "homemade"],
        type: "déjeuner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Omelette aux Épinards",
        description: "Omelette légère aux épinards et fromage.",
        recipe:
          "1. Battre les œufs.\n2. Ajouter les épinards et cuire l'omelette.\n3. Ajouter le fromage et servir chaud.",
        ingredients: [
          { name: "Œufs", quantity: 3, unit: "pcs" },
          { name: "Épinards", quantity: 50, unit: "g" },
          { name: "Fromage", quantity: 30, unit: "g" },
        ],
        macronutrients: { protein: 20, carbs: 5, fats: 15, calories: 250 },
        prepTime: "10 minutes",
        image: "https://i.postimg.cc/sgbVfw20/Omelette-aux-pinards.webp",
        tags: ["omelette", "spinach", "breakfast"],
        type: "déjeuner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Porridge aux Fruits",
        description: "Porridge crémeux avec des fruits frais et des noix.",
        recipe:
          "1. Cuire les flocons d'avoine dans le lait.\n2. Ajouter les fruits frais et les noix.\n3. Servir chaud.",
        ingredients: [
          { name: "Flocons d'avoine", quantity: 100, unit: "g" },
          { name: "Lait", quantity: 200, unit: "ml" },
          { name: "Fruits frais", quantity: 100, unit: "g" },
          { name: "Noix", quantity: 30, unit: "g" },
        ],
        macronutrients: { protein: 10, carbs: 50, fats: 10, calories: 350 },
        prepTime: "15 minutes",
        image: "https://i.postimg.cc/3xk8HP3v/Porridge-aux-Fruits.webp",
        tags: ["porridge", "fruits", "breakfast"],
        type: "déjeuner",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Pique-nique
      {
        title: "Sandwich au Poulet",
        description: "Sandwich au poulet grillé avec des légumes frais.",
        recipe:
          "1. Griller le poulet et le couper en tranches.\n2. Assembler le sandwich avec du pain, du poulet et des légumes frais.\n3. Servir avec une sauce au choix.",
        ingredients: [
          { name: "Poulet", quantity: 200, unit: "g" },
          { name: "Pain complet", quantity: 2, unit: "tranches" },
          { name: "Légumes frais", quantity: 100, unit: "g" },
        ],
        macronutrients: { protein: 30, carbs: 40, fats: 10, calories: 400 },
        prepTime: "15 minutes",
        image: "https://i.postimg.cc/qMbJSkHr/Sandwich-au-Poulet.webp",
        tags: ["sandwich", "chicken", "picnic"],
        type: "pique-nique",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Salade de Quinoa",
        description:
          "Salade de quinoa avec des légumes et une vinaigrette légère.",
        recipe:
          "1. Cuire le quinoa.\n2. Mélanger avec des légumes frais.\n3. Ajouter une vinaigrette légère et servir.",
        ingredients: [
          { name: "Quinoa", quantity: 200, unit: "g" },
          { name: "Légumes frais", quantity: 150, unit: "g" },
          { name: "Vinaigrette", quantity: 50, unit: "ml" },
        ],
        macronutrients: { protein: 10, carbs: 50, fats: 10, calories: 300 },
        prepTime: "20 minutes",
        image: "https://i.postimg.cc/kXXMT2Zw/Salade-de-Quinoa.webp",
        tags: ["salad", "quinoa", "picnic"],
        type: "pique-nique",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Wraps aux Légumes",
        description:
          "Wraps végétariens avec des légumes croquants et du houmous.",
        recipe:
          "1. Étaler le houmous sur les wraps.\n2. Ajouter les légumes croquants.\n3. Rouler les wraps et servir.",
        ingredients: [
          { name: "Wraps", quantity: 2, unit: "pcs" },
          { name: "Houmous", quantity: 100, unit: "g" },
          { name: "Légumes frais", quantity: 150, unit: "g" },
        ],
        macronutrients: { protein: 8, carbs: 40, fats: 12, calories: 300 },
        prepTime: "10 minutes",
        image: "https://i.postimg.cc/KjQGZbKn/Wraps-aux-L-gumes.webp",
        tags: ["wraps", "vegetarian", "picnic"],
        type: "pique-nique",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Taboulé",
        description:
          "Taboulé frais avec du boulgour, des tomates et du persil.",
        recipe:
          "1. Cuire le boulgour.\n2. Mélanger avec des tomates et du persil.\n3. Ajouter une vinaigrette légère et servir.",
        ingredients: [
          { name: "Boulgour", quantity: 200, unit: "g" },
          { name: "Tomates", quantity: 150, unit: "g" },
          { name: "Persil", quantity: 50, unit: "g" },
          { name: "Vinaigrette", quantity: 50, unit: "ml" },
        ],
        macronutrients: { protein: 8, carbs: 45, fats: 8, calories: 280 },
        prepTime: "20 minutes",
        image: "https://i.postimg.cc/KzPcHBxp/Taboul.webp",
        tags: ["tabbouleh", "salad", "picnic"],
        type: "pique-nique",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Fruits Frais",
        description: "Assortiment de fruits frais coupés en morceaux.",
        recipe:
          "1. Laver et couper les fruits en morceaux.\n2. Mélanger et servir frais.",
        ingredients: [{ name: "Fruits variés", quantity: 300, unit: "g" }],
        macronutrients: { protein: 2, carbs: 60, fats: 1, calories: 250 },
        prepTime: "10 minutes",
        image: "https://i.postimg.cc/fyMWnybz/Fruits-Frais.webp",
        tags: ["fruit", "fresh", "picnic"],
        type: "pique-nique",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const result = await meals.insertMany(newMeals);
    console.log(
      `${result.insertedCount} new meals inserted with the following ids: ${result.insertedIds}`
    );
  } finally {
    await client.close();
  }
}

main().catch(console.error);
