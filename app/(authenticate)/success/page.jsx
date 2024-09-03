"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    if (token) {
      fetch(`/api/success?token=${token}`)
        .then((response) => response.json())
        .then((data) => setCustomerData(data))
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
          <p>Chargement des données...</p>
        </div>
      )}
    </div>
  );
}

export default function SuccessPageWrapper() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SuccessPage />
    </Suspense>
  );
}
