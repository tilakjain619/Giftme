import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
    const token = req.cookies.get('authToken')?.value?.toString();

    // Ensure the token is a string
    if (!token || typeof token !== 'string') {
        console.log('No valid token found. Redirecting to /login'); // Debugging line
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        console.log('Token valid. Decoded payload:', payload); // Debugging line
        return NextResponse.next();
    } catch (error) {
        console.error('Token verification failed:', error); // Debugging line
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
  matcher: ['/dashboard'], // Apply middleware to all routes under /dashboard/
};
