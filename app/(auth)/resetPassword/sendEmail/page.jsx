"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

function Page() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage("Email de réinitialisation envoyé avec succès !");
      } else {
        setError(data.message || "Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="border border-gray-200 shadow-lg bg-white p-10 rounded-lg w-full max-w-md">
        <Link href={"/signin"}>
          <ArrowLeft className="mb-5 hover:text-primary-700 cursor-pointer" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Réinitialisation de{" "}
          <span className="text-primary-600">votre mot de passe</span>
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Entrez votre adresse email pour recevoir un lien de réinitialisation.
        </p>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form
          className="flex flex-col justify-center items-center gap-5"
          onSubmit={sendEmail}
        >
          <Input
            placeholder="Email"
            type="email"
            Icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full py-2 rounded-md transition-all"
            disabled={loading}
          >
            {loading ? "Envoi..." : "Confirmer"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Page;
