import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withAuth(
  async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // CAPTURAR IP UNA SOLA VEZ POR SESIÓN
    const ipSent = req.cookies.get('ip_sent');
    if (!ipSent) {
      const ip =
        req.ip ||
        req.headers.get('x-real-ip') ||
        req.headers.get('x-forwarded-for')?.split(',')[0] ||
        '0.0.0.0';

      // Enviar al backend
      fetch(process.env.NEXT_PUBLIC_API_URL+'/ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip }),
      }).catch(console.error);

      // Setear cookie para no volver a enviar
      res.cookies.set('ip_sent', 'true', {
        maxAge: 60 * 60 * 24, // 1 día
        path: '/',
      });
    }

    // AUTORIZACIÓN SOLO PARA /medico
    if (
      req.nextUrl.pathname.startsWith('/medico') &&
      req.nextauth.token?.role !== 'practitioner'
    ) {
      return NextResponse.rewrite(
        new URL('/login?message=No tienes permisos para acceder a esta página', req.url)
      );
    }

    return res;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/:path*'], // Aplica a todas las rutas
};
