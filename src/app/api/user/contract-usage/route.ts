import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getContractUsage } from '@/lib/contractLimits';

export async function GET(request: Request) {
  const user = await currentUser();

  console.log('🔍 /api/user/contract-usage - user:', user?.id);

  if (!user?.id) {
    console.log('❌ /api/user/contract-usage - No user found');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const usage = await getContractUsage(user.id);
    
    console.log('✅ /api/user/contract-usage - usage:', usage);
    
    return NextResponse.json({
      success: true,
      usage
    });
  } catch (error: any) {
    console.error('Error fetching contract usage:', error);
    return NextResponse.json({
      error: 'Failed to fetch contract usage',
      details: error.message
    }, { status: 500 });
  }
}
