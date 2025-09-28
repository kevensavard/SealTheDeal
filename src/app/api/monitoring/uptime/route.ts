import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { monitoringService } from '@/lib/monitoring';
import { isAdminServer } from '@/lib/admin';

export async function GET() {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = await isAdminServer(user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
  }

  try {
    const healthCheck = await monitoringService.performHealthCheck();
    const systemInfo = monitoringService.getSystemInfo();

    // Calculate uptime percentage based on actual system uptime
    const systemUptime = systemInfo.uptime;
    const uptimePercentage = systemUptime > 0 ? Math.min(100, (systemUptime / (30 * 24 * 60 * 60)) * 100) : 100; // 30 days as baseline
    
    return NextResponse.json({
      success: true,
      data: {
        status: healthCheck.status,
        uptime: {
          percentage: uptimePercentage,
          seconds: systemInfo.uptime,
          since: new Date(Date.now() - systemInfo.uptime * 1000),
        },
        lastChecked: healthCheck.timestamp,
        responseTime: healthCheck.response_time,
      },
    });
  } catch (error) {
    console.error('Error checking uptime:', error);
    return NextResponse.json({ 
      error: 'Failed to check uptime',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
