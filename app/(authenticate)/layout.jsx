"use client";

import NavBar from "../components/NavBar";
import AuthProvider from "../context/Authprovider";

export default function RootLayout({ children }) {
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
