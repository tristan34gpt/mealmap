"use client";

import { useSession } from "next-auth/react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import AuthProvider from "../context/Authprovider";

export default function RootLayout({ children }) {
  const { data: session, status } = useSession();

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
