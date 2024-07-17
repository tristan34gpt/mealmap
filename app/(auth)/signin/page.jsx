"use client";

import { useRef, useState } from "react";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function Signin() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const router = useRouter();
  const [error, setError] = useState("");
  const handleSignIn = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result.error) {
      setError("Email ou Mot de passe invalide");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col h-[100vh] justify-center items-center">
      <h1 className="text-3xl font-medium mb-[40px]">Connectez-vous !</h1>
      <form className="flex flex-col items-center" onSubmit={handleSignIn}>
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
        {error !== "" && (
          <p className="text-red-600 font-normal mb-1">{error}</p>
        )}
        <Button type="submit" className="w-[300px] h-[40px]">
          Se connecter
        </Button>
      </form>
      <div className="border-b border-[1px] border-gray-300 w-[500px] mt-5 mb-5"></div>
      <button
        onClick={() => signIn("google")}
        className="bg-white border border-1 rounded-lg p-3 w-[400px] mb-5  hover:bg-gray-200 transition-all"
      >
        Se connecter avec Google
      </button>
      <button className="bg-white border border-1 rounded-lg p-3 w-[400px] hover:bg-gray-200 transition-all">
        Se connecter avec Ghithub
      </button>

      <p className="mt-2">
        Vous n’avez pas de compte ?{" "}
        <Link href="/signup/signupWithEmail">
          <span className="text-primary-700">Inscrivez-vous</span>
        </Link>
      </p>
    </div>
  );
}

export default Signin;
