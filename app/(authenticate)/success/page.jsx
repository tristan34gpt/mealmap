"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function SuccessPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    if (token) {
      fetch
        .get(`/api/success`, { params: { token } })
        .then((response) => setCustomerData(response.data))
        .catch((error) => console.error(error));
    }
  }, [token]);

  if (!token) {
    return <div>Chargement...</div>;
  }
  return (
    <div>
      <h1>Paiement réussi !</h1>
      {customerData ? (
        <div>
          <p>Merci pour votre achat, {customerData?.name}</p>
          <ul>
            <li>Email: {customerData?.email}</li>
          </ul>
        </div>
      ) : (
        <div>
          <p>Chargement des donées...</p>
        </div>
      )}
    </div>
  );
}

export default SuccessPage;
