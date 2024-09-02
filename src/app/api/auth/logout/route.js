import { serialize } from 'cookie';

export async function POST(req) {
  const cookie = serialize('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1,  // Expire the cookie immediately
    path: '/',
  });

  return new Response(null, {
    status: 200,
    headers: {
      'Set-Cookie': cookie,
    },
  });
}
