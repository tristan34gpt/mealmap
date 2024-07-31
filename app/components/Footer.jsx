"use client";

import { Mail, Scale, Wallet } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center p-4">
      <div className="flex justify-between p-5 items-center">
        <h2 className="text-2xl font-semibold">MealMap</h2>
        <div className="flex flex-col">
          <Link
            className=" text-[18px] flex items-center hover:text-primary-500 transition-all hover:underline"
            href={"/"}
          >
            <Scale size={25} className="mr-2" /> CGV
          </Link>
          <Link
            className=" text-[18px] flex items-center hover:text-primary-500 transition-all hover:underline"
            href={"/"}
          >
            <Wallet size={25} className="mr-2" />
            Abonnement
          </Link>
          <Link
            className=" text-[18px] flex items-center hover:text-primary-500 transition-all hover:underline"
            href={"/"}
          >
            <Mail size={25} className="mr-2" /> Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
