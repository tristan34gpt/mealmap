"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Page() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setError("Le token est manquant ou invalide.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/newPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage("Mot de passe réinitialisé avec succès.");
        router.push("/signin");
      } else {
        setError(data.message || "Erreur lors de la réinitialisation.");
      }
    } catch (error) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="border border-gray-200 shadow-lg bg-white p-10 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Créer votre nouveau{" "}
          <span className="text-primary-600">mot de passe</span>
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Entrez votre nouveau mot de passe pour le réinitialiser.
        </p>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form
          className="flex flex-col justify-center items-center gap-5"
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="*******"
            type="password"
            Icon={LockKeyhole}
            value={password}
            label={"Nouveau mot de passe"}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            placeholder="*******"
            type="password"
            Icon={LockKeyhole}
            value={confirmPassword}
            label={"Confirmer le mot de passe"}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
