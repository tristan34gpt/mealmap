"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import ModalProfile from "@/app/components/ModalProfile";

import { LockKeyhole, Mail, User } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

function page() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  console.log(session);
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <div className="mt-[70px]">
      <h1 className=" font-semibold m-5 text-center text-gray-700 text-[20px]">
        Information du profil
      </h1>
      <div className="flex  flex-col justify-center items-center p-5">
        <Input
          type="email"
          placeholder="john@gmail.com"
          Icon={Mail}
          label="Mail"
          value={session.user.email}
          disabled={"disabled"}
          className={"mb-5"}
        />
        <Input
          type="password"
          placeholder="*********"
          Icon={LockKeyhole}
          label="Mot de passe"
          disabled={"disabled"}
          className={"mb-5"}
        />
        <Input
          type="text"
          placeholder="John"
          Icon={User}
          label="Prénom"
          value={session.user.firstName}
          disabled={"disabled"}
          className={"mb-5"}
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
        <Button
          click={() => {
            setOpen(true);
          }}
          className={"w-[300px] h-[30px] mt-[30px]"}
        >
          Modifier
        </Button>
      </div>
      {open && (
        <ModalProfile isOpen={Boolean(open)} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default page;
