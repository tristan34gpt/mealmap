function ErrorPage({ error }) {
  let errorMessage = "";

  switch (error) {
    case "OAuthAccountNotLinked":
      errorMessage =
        "Votre compte Google n'est pas lié à un compte existant. Veuillez vous inscrire d'abord.";
      break;
    // Gérez d'autres cas d'erreur si nécessaire
    default:
      errorMessage = "Une erreur est survenue. Veuillez réessayer.";
  }

  return (
    <div>
      <h1>Erreur de connexion</h1>
      <p>{errorMessage}</p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ query }) => {
  return {
    error: query.error,
  };
};

export default ErrorPage;
