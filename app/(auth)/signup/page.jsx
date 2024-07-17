"use client";

import { useRef } from "react";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { LockKeyhole, User, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

function SignupWithEmail() {
  // Variables
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const router = useRouter();

  // Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const firstName = firstNameRef.current.value;
      const lastName = lastNameRef.current.value;
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      console.log("Sending data to API:", {
        firstName,
        lastName,
        email,
        password,
      }); // Log pour vérifier les données envoyées

      const response = await axios.post("/api/users", {
        firstName,
        lastName,
        email,
        password,
      });

      console.log("Response from API:", response.data); // Log pour vérifier la réponse de l'API
      router.push("/");
    } catch (error) {
      console.error("Error during user creation: ", error);
      // Gérer les erreurs ici
    }
  };

  return (
    <div className="flex flex-col h-[100vh] justify-center items-center">
      <h1 className="text-3xl font-medium mb-[50px]">
        Incrivez-vous Gratuitement
      </h1>
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <Input
          type="text"
          placeholder="John"
          Icon={User}
          label="Prénom"
          inputRef={firstNameRef}
          className="mb-5"
        />
        <Input
          type="text"
          placeholder="Martinez"
          Icon={User}
          label="Nom"
          inputRef={lastNameRef}
          className="mb-5"
        />
        <Input
          type="email"
          placeholder="john@gmail.com"
          Icon={Mail}
          label="Mail"
          inputRef={emailRef}
          className="mb-5"
        />
        <Input
          type="password"
          placeholder="*********"
          Icon={LockKeyhole}
          label="Mot de passe"
          inputRef={passwordRef}
          className="mb-5"
        />
        <Button className="w-[300px] h-[40px] mt-5" type="submit">
          S'inscrire
        </Button>
      </form>
      <p className="mt-5">
        Vous avez déjà un compte?{" "}
        <span className="text-primary-700">
          <Link href="/signin">Connectez-vous</Link>
        </span>
      </p>
    </div>
  );
}

export default SignupWithEmail;
