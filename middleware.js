import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  // Obtenez le jeton de l'utilisateur (le jeton est nul si l'utilisateur n'est pas connecté)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Si le jeton est présent, continuez avec la requête
  if (token) {
    return NextResponse.next();
  }

  // Si le jeton est absent, redirigez vers /signin avec callbackUrl
  const url = req.nextUrl.clone();
  url.pathname = "/signin";
  url.searchParams.set("callbackUrl", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

// Configurez le middleware pour qu'il s'applique uniquement aux routes protégées
export const config = {
  matcher: ["/dashboard", "/profile", "/repas", "/", "/api/meal/:path*"], // Ajoutez les routes que vous voulez protéger
};
