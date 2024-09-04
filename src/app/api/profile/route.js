// app/api/profile/route.js (or wherever your API route is defined)
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

export async function GET(request) {
  const url = new URL(request.url);
  const username = url.searchParams.get('username');

  if (!username) {
    return new Response(JSON.stringify({ error: 'Username is required' }), { status: 400 });
  }

  try {
    await dbConnect();
    const profile = await User.findOne({ username });

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404 });
    }

    const { password, ...publicProfile } = profile.toObject();
    return new Response(JSON.stringify(publicProfile), { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new Response(JSON.stringify({ error: 'An error occurred while fetching the profile' }), { status: 500 });
  }
}
