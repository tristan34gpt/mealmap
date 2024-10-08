"use client";

import Button from "@/app/components/Button";
import { useSession } from "next-auth/react";
import { Check } from "lucide-react"; // Importer l'icône Check depuis lucide-react
import { useEffect, useState } from "react";
import Loader from "@/app/components/Loader";

function Subscription() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (session && session.user) {
      console.log(session.user);
      setPlan(session.user.plan);
    }
  }, [session]);

  useEffect(() => {
    if (plan !== null) {
      setLoading(false);
    }
  }, [plan]);
  const checkout = async () => {
    try {
      // Vérifier si l'utilisateur est authentifié
      if (status !== "authenticated") {
        throw new Error("Vous devez être connecté pour vous abonner.");
      }

      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Plan Premium",
          price: 4.99,
          email: session.user.email, // Envoyer l'email de l'utilisateur
        }),
      });

      if (!response.ok) {
        throw new Error("Échec de la création de la session de paiement.");
      }

      const responseData = await response.json();
      console.log(responseData);
      window.location.href = responseData.url;
    } catch (error) {
      console.error("Erreur", error);
      alert(error.message); // Affiche une alerte si une erreur survient
    }
  };

  return (
    <>
      <h1 className="text-center mt-5 font-semibold text-3xl text-gray-800">
        Offre d'abonnement
      </h1>
      <div className="flex items-center justify-center p-5 mt-24">
        <div className="mr-5 border p-6 rounded-lg text-center bg-white shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mt-2">
            Abonnement Gratuit
          </h2>
          <ul className="mt-5 text-gray-600 space-y-2">
            <li className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              Accès à tous les repas
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              Planification de 2 repas par semaine
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              Accès à la gestion des courses
            </li>
          </ul>
          <p className="mt-5 text-lg font-semibold text-gray-700">
            Prix : Gratuit
          </p>
          {loading ? (
            <div className="flex items-center justify-center mt-2">
              <Loader />
            </div>
          ) : plan !== "Plan freemium" ? (
            <Button
              className="mt-5 w-[150px] h-[40px]"
              click={checkout}
              disabled={status !== "authenticated"}
            >
              Choisir
            </Button>
          ) : (
            <Button
              className={
                "mt-5 w-[150px] h-[40px] bg-green-500 hover:bg-green-500"
              }
              disabled
            >
              Plan actuel
            </Button>
          )}
        </div>
        <div className="ml-5 border p-6 rounded-lg text-center bg-white shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mt-2">
            Abonnement Premium
          </h2>
          <ul className="mt-5 text-gray-600 space-y-2">
            <li className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              Accès à tous les repas
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              Planification de repas illimitée
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              Accès à la gestion des courses
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              Création de vos propres repas
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              Assistance rapide
            </li>
          </ul>
          <p className="mt-5 text-lg font-semibold text-gray-700">
            Prix : 5.99€/mois
          </p>
          {loading ? (
            <div className="flex items-center justify-center mt-2">
              <Loader />
            </div>
          ) : plan !== "Plan Premium" ? (
            <Button
              className="mt-5 w-[150px] h-[40px]"
              click={checkout}
              disabled={status !== "authenticated"}
            >
              Choisir
            </Button>
          ) : (
            <Button
              className={
                "mt-5 w-[150px] h-[40px] bg-green-500 hover:bg-green-500"
              }
            >
              Plan actuel
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

export default Subscription;
