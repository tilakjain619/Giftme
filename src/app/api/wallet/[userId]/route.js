import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(req, {params}) {
    const { userId } = params;
  await dbConnect();

  try {
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ walletAmount: user.walletAmount }, { status: 200 });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
