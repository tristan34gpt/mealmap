export const POST = async (req) => {
  try {
    const { firstName, lastName, password, email } = await req.json();
    console.log("Received data:", { firstName, lastName, password, email });

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      // Vérifier si un compte Google existe déjà pour cet utilisateur
      const googleAccount = existingUser.accounts.find(
        (account) => account.provider === "google"
      );

      if (googleAccount) {
        // Si un compte Google existe, ajouter un mot de passe à cet utilisateur
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
          where: { email },
          data: {
            password: hashedPassword, // Ajouter le mot de passe
            firstName: firstName || existingUser.firstName, // Mettre à jour les autres infos si elles manquent
            lastName: lastName || existingUser.lastName,
          },
        });

        return NextResponse.json(
          {
            message: "Mot de passe ajouté au compte existant.",
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          message: "Email is already in use.",
        },
        { status: 400 }
      );
    }

    // Si aucun utilisateur n'existe, créer un nouvel utilisateur avec des credentials
    const newUser = await createUserWithAccount({
      firstName,
      lastName,
      password,
      email,
    });
    return NextResponse.json(
      {
        message: "User created",
        data: newUser,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error during user creation: ", e);
    return NextResponse.json(
      {
        message: "Error",
        error: e.message,
      },
      { status: 500 }
    );
  }
};

export async function getUserByEmail(email) {
  try {
    // Trouver l'utilisateur avec l'email, y compris les comptes associés
    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true }, // Inclure les comptes associés
    });
    return user;
  } catch (error) {
    console.error("Error getting user by email: ", error);
    throw error;
  }
}
