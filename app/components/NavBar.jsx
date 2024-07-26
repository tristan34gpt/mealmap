import React, { useState } from "react";
import Link from "next/link";
import Button from "./Button";
import { signOut } from "next-auth/react";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkNavBar = [
    {
      link: "/dashboard",
      label: "Dashboard",
    },
    {
      link: "/profil",
      label: "Profil",
    },
    {
      link: "/repas",
      label: "Repas",
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-1 mb-5 relative">
      <nav className="flex items-center justify-between p-5">
        <Link href={"/dashboard"} className="text-xl font-bold">
          Logo
        </Link>
        <div className="lg:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-800 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
        <ul className="hidden lg:flex lg:items-center lg:space-x-6">
          {linkNavBar.map((link, index) => (
            <li key={index}>
              <Link
                href={link.link}
                className="text-gray-800 hover:text-gray-600"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Button
              click={() => signOut()}
              className={"w-[150px] h-[30px] hover:bg-red-500"}
            >
              Déconnexion
            </Button>
          </li>
        </ul>
      </nav>
      {isOpen && (
        <div className="fixed inset-x-0 z-50  bg-white p-5 shadow-lg lg:hidden">
          <ul className="flex flex-col items-center space-y-4">
            {linkNavBar.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.link}
                  className="text-gray-800 hover:text-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Button
                click={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className={"w-[150px] h-[30px] hover:bg-red-500"}
              >
                Déconnexion
              </Button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default NavBar;
