"use client";
import { useRef, useState } from "react";
import { LockKeyhole, User, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

import axios from "axios";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Link from "next/link";

function SignupWithEmail() {
  // Variables
  const [loading, setLoading] = useState(false);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const router = useRouter();

  // Functions
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const firstName = firstNameRef.current.value;
      const lastName = lastNameRef.current.value;
      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      const response = await axios.post("/api/users", {
        firstName,
        lastName,
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Bravo, vous venez de vous inscrire.");
        router.push("/signin");
      } else {
        toast.error("Une erreur s'est produite, veuillez réessayer plus tard.");
      }
    } catch (error) {
      console.error("Error during user creation: ", error);
      toast.error("Une erreur s'est produite, veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
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
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <Button type="submit" className="w-[300px] h-[40px]">
            S'inscrire
          </Button>
        )}
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
