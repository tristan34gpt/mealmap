"use client";

import { useSession } from "next-auth/react";
import NavBar from "../components/NavBar";
import AuthProvider from "../context/Authprovider";

export default function RootLayout({ children }) {
  const { data: session, status } = useSession();

  console.log(session);

  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
