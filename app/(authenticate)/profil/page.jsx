"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { LockKeyhole, Mail, User } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

function page() {
  const { data: session, status } = useSession();
  console.log(session);
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-[70px]">
      <h1 className=" font-semibold m-5">Information du profil</h1>
      <div className="flex justify-around flex-wrap p-5">
        <Input
          type="email"
          placeholder="john@gmail.com"
          Icon={Mail}
          label="Mail"
          value={session.user.email}
          disabled={"disabled"}
        />
        <Input
          type="password"
          placeholder="*********"
          Icon={LockKeyhole}
          label="Mot de passe"
          disabled={"disabled"}
        />
        <Input
          type="text"
          placeholder="John"
          Icon={User}
          label="Prénom"
          value={session.user.firstName}
          disabled={"disabled"}
        />
        <Input
          type="text"
          placeholder="Martinez"
          Icon={User}
          label="Nom"
          value={session.user.lastName}
          disabled={"disabled"}
        />
      </div>
      <div className="flex justify-center items-center">
        <Button className={"w-[300px] h-[30px] mt-[30px]"}>Modifier</Button>
      </div>
    </div>
  );
}

export default page;
