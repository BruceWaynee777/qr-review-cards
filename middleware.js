import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get('admin_auth')?.value;
  const isAuthed = cookie && cookie === process.env.ADMIN_PASSWORD;

  if (!isAuthed) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/cards/:path*'],
};
