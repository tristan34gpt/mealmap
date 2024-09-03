const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const plan = await prisma.plan.create({
    data: {
      name: "Plan Premium", // Nom du plan
      price: 5.99, // Prix en euros
      interval: "month", // Intervalle de facturation (par exemple, 'month' ou 'year')
    },
  });

  console.log("Plan créé avec succès :", plan);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
