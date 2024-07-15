import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { LockKeyhole, User, Mail } from "lucide-react";
import Link from "next/link";

function signinWithEmail() {
  return (
    <>
      <div className="flex flex-col h-[100vh] justify-center items-center">
        <h1 className="text-3xl font-medium mb-[50px]">
          Incrivez-vous Gratuitement
        </h1>
        <form className={"flex flex-col justify-center items-center"} action="">
          <Input
            type={"text"}
            placeholder={"John"}
            Icon={User}
            label={"Prénom"}
            className={"mb-5"}
          />
          <Input
            type={"text"}
            placeholder={"Martinez"}
            Icon={User}
            label={"Nom"}
            className={"mb-5"}
          />
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
          />
          <Button className={"w-[300px] h-[40px] mt-5  "} type="submit">
            S'inscrire
          </Button>
        </form>
        <p className="mt-5">
          Vous avez déja un compte ?{" "}
          <span className="text-primary-700 ">
            <Link href={"/signin"}>Connectez-vous</Link>
          </span>
        </p>
      </div>
    </>
  );
}

export default signinWithEmail;
