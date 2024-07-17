"use client";

import { useRef } from "react";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function SignInWithEmail() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const router = useRouter();

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
      setError("Invalid email/password");
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
        <Button type="submit" className="w-[300px] h-[40px]">
          Se connecter
        </Button>
      </form>
      <p className="mt-2">
        Vous n’avez pas de compte ?{" "}
        <Link href="/signup/signupWithEmail">
          <span className="text-primary-700">Inscrivez-vous</span>
        </Link>
      </p>
    </div>
  );
}

export default SignInWithEmail;
