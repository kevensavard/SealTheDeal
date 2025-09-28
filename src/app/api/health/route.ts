import { NextResponse } from 'next/server';
import { monitoringService } from '@/lib/monitoring';

export async function GET() {
  try {
    const healthCheck = await monitoringService.performHealthCheck();
    
    const statusCode = healthCheck.status === 'healthy' ? 200 : 
                      healthCheck.status === 'degraded' ? 200 : 503;

    return NextResponse.json(healthCheck, { status: statusCode });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date(),
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 503 });
  }
}
