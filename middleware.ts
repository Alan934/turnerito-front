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
        req.headers.get('x-real-ip') ||
        req.headers.get('x-forwarded-for')?.split(',')[0] ||
        '0.0.0.0';

      fetch(process.env.NEXT_PUBLIC_API_URL + '/ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip }),
      }).catch(console.error);

      res.cookies.set('ip_sent', 'true', {
        maxAge: 60 * 60 * 24,
        path: '/',
      });
    }

    // AUTORIZACIÓN SOLO PARA /medico
    if (
      req.nextUrl.pathname.startsWith('/medico') &&
      (req as any).nextauth.token?.role !== 'practitioner'
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
  matcher: ['/((?!api|login|_next/static|_next/image|favicon.ico).*)'],
};