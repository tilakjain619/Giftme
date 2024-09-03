import bcrypt from 'bcryptjs';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { generateToken } from '@/utils/jwt';
import { serialize } from 'cookie';

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return new Response(JSON.stringify({ error: 'Password is incorrect' }), { status: 401 });
    }

    // Generate JWT
    const token = generateToken(user);

    // Set JWT in a cookie
    const cookie = serialize('authToken', token, {
      // httpOnly: true,  // Makes the cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
      maxAge: 60 * 60,  // 1 hour
      path: '/',  // Root path
    });

    return new Response(JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    }), {
      status: 200,
      headers: {
        'Set-Cookie': cookie
      },
    });

  } catch (error) {
    console.error('Error during login:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
