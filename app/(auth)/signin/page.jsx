"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LockKeyhole, Mail } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

import Link from "next/link";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";

function Signin() {
  // Variables
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //Functions
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);
      toast.success("Vous êtes connecté");
      if (result.error) {
        setError("Email ou Mot de passe invalide");
        setLoading(false);
      } else {
        router.push("/dashboard");
        setLoading(false);
      }
    } catch (e) {
      toast.error("Une erreur s'est produite, veuillez réessayer plus tard.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Google sign-in with redirection
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (e) {
      toast.error("Une erreur s'est produite avec Google, veuillez réessayer.");
      setLoading(false);
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
        {loading ? (
          <div>chargement...</div>
        ) : (
          <Button type="submit" className="w-[300px] h-[40px]">
            Se connecter
          </Button>
        )}
      </form>
      <div className="border-b border-[1px] border-gray-300 w-[500px] mt-5 mb-5"></div>
      <button
        onClick={handleGoogleSignIn}
        className="bg-white border border-1 rounded-lg p-3 w-[400px] mb-5  hover:bg-gray-200 transition-all"
      >
        Se connecter avec Google
      </button>
      <button className="bg-white border border-1 rounded-lg p-3 w-[400px] hover:bg-gray-200 transition-all">
        Se connecter avec GitHub
      </button>

      <p className="mt-2">
        Vous n’avez pas de compte ?{" "}
        <Link href="/signup">
          <span className="text-primary-700">Inscrivez-vous</span>
        </Link>
      </p>
    </div>
  );
}

export default Signin;
