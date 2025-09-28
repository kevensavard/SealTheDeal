import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { monitoringService } from '@/lib/monitoring';
import { isAdminServer } from '@/lib/admin';

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = await isAdminServer(user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const minutes = parseInt(searchParams.get('minutes') || '60');
    
    const metrics = monitoringService.getMetrics();
    const aggregatedMetrics = monitoringService.getAggregatedMetrics(minutes);
    const systemInfo = monitoringService.getSystemInfo();

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        aggregated: aggregatedMetrics,
        system: systemInfo,
        timeRange: minutes,
      },
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch metrics',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
