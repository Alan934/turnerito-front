import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    // Captura la IP del usuario solo desde los headers
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Envía la IP al backend (no esperes la respuesta para no bloquear el flujo)
    fetch("https://api-full-salud.vercel.app/api/ip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip }),
    }).catch(() => {});

    // Lógica de autorización
    if (
      req.nextUrl.pathname.startsWith("/medico") &&
      req.nextauth.token?.role !== "practitioner"
    ) {
      return NextResponse.rewrite(
        new URL(
          "/login?message=No tienes permisos para acceder a esta página",
          req.url
        )
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/medico/:path*"],
};
