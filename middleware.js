import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  console.log("ok");

  const { pathname, method } = req.nextUrl;
  // Exclure les requêtes liées à l'authentification et les POST vers /api/auth/callback/credentials
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/signin") ||
    (pathname === "/api/auth/callback/credentials" && method === "POST")
  ) {
    return NextResponse.next();
  }
  // Obtenir le jeton de l'utilisateur
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("Token:", token); // Debugging
  // Si un jeton est présent, permettre la continuation
  if (token) {
    return NextResponse.next();
  }
  // Si pas de jeton, rediriger vers /signin avec callbackUrl
  const url = req.nextUrl.clone();
  url.pathname = "/signin";
  url.searchParams.set("callbackUrl", req.nextUrl.pathname);
  console.log("Redirecting to:", url.toString()); // Debugging
  return NextResponse.redirect(url);
}
// Appliquer le middleware uniquement aux routes protégées
export const config = {
  matcher: ["/dashboard", "/profil", "/repas", "/", "/api/meal/:path*"],
};
