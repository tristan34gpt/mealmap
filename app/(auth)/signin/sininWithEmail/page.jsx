import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { LockKeyhole, User, Mail } from "lucide-react";
import Link from "next/link";

function sininWithEmail() {
  return (
    <div className="flex flex-col h-[100vh] justify-center items-center">
      <h1 className="text-3xl font-medium mb-[40px]">Connectez-vous ! </h1>
      <form className="flex flex-col items-center" action="">
        <Input
          type={"email"}
          placeholder={"john@gmail.com"}
          Icon={Mail}
          label={"Mail"}
          className={"mb-5"}
        />
        <Input
          type={"password"}
          placeholder={"*********"}
          Icon={LockKeyhole}
          label={"Mot de passe"}
          className={"mb-5"}
        />{" "}
        <Button type="submit" className={"w-[300px] h-[40px]"}>
          Se connecter
        </Button>
      </form>
      <p className="mt-2">
        Vous n’avez pas de compte ?{" "}
        <Link href={"/signup/signupWithEmail"}>
          <span className="text-primary-700">Inscrivez-vous</span>
        </Link>
      </p>
    </div>
  );
}

export default sininWithEmail;
