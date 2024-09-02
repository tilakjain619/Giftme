import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';

export function middleware(req) {
    const token = req.cookies.get('authToken');
    if (!token) {
      console.log('No token found. Redirecting to /login'); // Debugging line
      return NextResponse.redirect(new URL('/login', req.url));
    }
  
    try {
      verifyToken(token);
      console.log('Token valid. Allowing access'); // Debugging line
      return NextResponse.next();
    } catch (error) {
      console.error('Token verification failed:', error); // Debugging line
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  

export const config = {
  matcher: ['/dashboard/'], // Apply middleware to all routes under /dashboard/
};
