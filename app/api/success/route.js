export async function getServerSideProps(context) {
  const { query } = context;
  const token = query.token;

  if (!token) {
    return {
      notFound: true,
    };
  }

  const customer = await stripe.customers.retrieve(token);

  if (customer.deleted) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      customerData: {
        name: customer.name,
        email: customer.email,
      },
    },
  };
}

export default function SuccessPage({ customerData }) {
  return (
    <div>
      <h1>Paiement réussi !</h1>
      <p>Merci pour votre achat, {customerData.name}</p>
      <ul>
        <li>Email: {customerData.email}</li>
      </ul>
    </div>
  );
}
