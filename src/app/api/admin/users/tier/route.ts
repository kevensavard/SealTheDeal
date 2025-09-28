import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { isAdminServer, setUserTier } from '@/lib/admin';
import { UserTier } from '@prisma/client';

export async function PUT(request: Request) {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = await isAdminServer(user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { clerkId, tier } = body;

    if (!clerkId || !tier) {
      return NextResponse.json({ error: 'clerkId and tier are required' }, { status: 400 });
    }

    if (!Object.values(UserTier).includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier. Must be FREE, PRO, or ADMIN' }, { status: 400 });
    }

    const success = await setUserTier(clerkId, tier);

    if (success) {
      return NextResponse.json({
        success: true,
        message: `User tier updated to ${tier}`
      });
    } else {
      return NextResponse.json({ error: 'Failed to update user tier' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error updating user tier:', error);
    return NextResponse.json({
      error: 'Failed to update user tier',
      details: error.message
    }, { status: 500 });
  }
}
