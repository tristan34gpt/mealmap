import React, { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { useSession } from "next-auth/react";
import { LockKeyhole, Mail, User } from "lucide-react";

function ModalProfile({ isOpen, onClose }) {
  const { data: session } = useSession();
  const [firstName, setFirstName] = useState(session?.user?.firstName || "");
  const [lastName, setLastName] = useState(session?.user?.lastName || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  if (!isOpen) return null;

  const handleSaveMeal = async (e) => {
    e.preventDefault();
    if (firstName && lastName && email) {
      try {
        const userId = session?.user?.id; // Assurez-vous que l'utilisateur est authentifié et que l'ID est disponible

        if (!userId) {
          alert("User not authenticated");
          return;
        }

        const response = await fetch("/api/user/modifyInfoUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
          }),
        });

        if (response.ok) {
          alert("Meal planned successfully!");
          onClose();
        } else {
          alert("Failed to plan meal.");
        }
      } catch (error) {
        console.error("Error planning meal:", error);
      }
    }
  };

  return (
    <div className="fixed z-50 inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <div className=" bg-red-500">
          <button
            className="text-white rounded-lg p-1 text-[14px] w-[70px] float-right bg-primary-700 hover:bg-red-500"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
        <div className="flex flex-col justify-center items-center w-full mb-5 ">
          <h1 className="font-semibold my-5 text-[18px]">
            Modifier votre profil
          </h1>
          <form
            className="flex flex-col justify-center items-center"
            onSubmit={handleSaveMeal}
          >
            {session && session.user.provider === "credentials" ? (
              <>
                <Input
                  type="text"
                  placeholder="John"
                  Icon={User}
                  label="Prénom"
                  value={firstName}
                  className={"mb-5"}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <Input
                  type="text"
                  placeholder="Martinez"
                  Icon={User}
                  label="Nom"
                  value={lastName}
                  className={"mb-5"}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="john@gmail.com"
                  Icon={Mail}
                  label="Mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={"mb-5"}
                />
              </>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder="John"
                  Icon={User}
                  label="Prénom"
                  value={firstName}
                  disabled={true}
                  className={"mb-5"}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Martinez"
                  Icon={User}
                  label="Nom"
                  value={lastName}
                  disabled={true}
                  className={"mb-5"}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </>
            )}
            <Button type="submit" className={"w-[150px] h-[30px] my-5"}>
              Modifier le profil
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalProfile;
