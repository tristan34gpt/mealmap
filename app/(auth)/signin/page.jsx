"use client";

import Button from "@/app/components/Button";
import { signIn } from "next-auth/react";
import Link from "next/link";

function Signin() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-[100vh]">
        <h1 className="text-4xl font-medium mb-[50px] text-center ">
          Connectez-vous
        </h1>
        <Link href={"/signin/sininWithEmail"}>
          <Button className={"w-[400px] h-[50px] text-white mb-5"}>
            Se connecter avec Email
          </Button>
        </Link>
        <div className="border-b border-[1px] border-gray-500 w-[600px]"></div>
        <Button
          className={"w-[400px] h-[50px] text-white mt-5"}
          click={() => signIn("google")}
        >
          Se connecter avec Google
        </Button>
        <p className="mt-2">
          Vous n’avez pas de compte ?{" "}
          <Link href={"/signup/signupWithEmail"}>
            <span className="text-primary-700">Inscrivez-vous</span>
          </Link>
        </p>
      </div>
    </>
  );
}

export default Signin;
