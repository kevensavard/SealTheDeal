import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getUserTier, isAdminServer } from '@/lib/admin';

export async function GET(request: Request) {
  const user = await currentUser();

  console.log('🔍 /api/user/tier - user:', user?.id);

  if (!user?.id) {
    console.log('❌ /api/user/tier - No user found');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tier = await getUserTier(user.id);
    const isAdmin = await isAdminServer(user.id);
    
    console.log('✅ /api/user/tier - tier:', tier, 'isAdmin:', isAdmin);
    
    return NextResponse.json({
      success: true,
      tier: tier || 'FREE',
      isAdmin,
      isPro: tier === 'PRO'
    });
  } catch (error: any) {
    console.error('Error fetching user tier:', error);
    return NextResponse.json({
      error: 'Failed to fetch user tier',
      details: error.message
    }, { status: 500 });
  }
}
