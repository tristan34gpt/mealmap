"use client";

import { useSession } from "next-auth/react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

import AuthProvider from "../context/Authprovider";

export default function RootLayout({ children }) {
  const { data: session, status } = useSession();
  // if (status === "loading") {
  //   return (
  //     <div className="h-screen w-full flex justify-center items-center">
  //       <Loader />
  //     </div>
  //   );
  // }
  console.log(status);
  return (
    <html lang="fr" className="h-full">
      <body className="h-full">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <NavBar />

            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
