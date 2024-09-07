import bcrypt from 'bcryptjs';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

export async function POST(req) {
    try {
        await dbConnect();
        const { fullName, email, password, username, bio, theme, socialLinks, upiId } = await req.json();
        // Validate the input
        if (!fullName || !email || !password || !username) {
            return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
        }

        // Check if the email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 400 });
        }

        // Check if the username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return new Response(JSON.stringify({ error: 'Username already in use' }), { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            username,
            bio,
            theme,
            socialLinks,
            upiId,
            walletAmount: 0
        });
        // Respond with the created user (excluding the password)
        return new Response(JSON.stringify({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
        }), { status: 200 });

    } catch (error) {
        console.error('Error during signup:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}