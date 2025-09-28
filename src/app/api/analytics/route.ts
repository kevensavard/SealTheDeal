import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');
    const period = searchParams.get('period') || '30'; // days

    if (!clerkId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all contracts for the user
    const contracts = await prisma.contract.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startDate
        }
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            company: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate metrics
    const totalContracts = contracts.length;
    const signedContracts = contracts.filter(c => c.status === 'SIGNED').length;
    const sentContracts = contracts.filter(c => c.status === 'SENT').length;
    const draftContracts = contracts.filter(c => c.status === 'DRAFT').length;
    const expiredContracts = contracts.filter(c => c.status === 'EXPIRED').length;

    // Conversion rate (sent vs signed)
    const conversionRate = sentContracts > 0 ? (signedContracts / sentContracts) * 100 : 0;

    // Average turnaround time (from sent to signed)
    const signedWithTimestamps = contracts.filter(c => 
      c.status === 'SIGNED' && c.sentAt && c.signedAt
    );

    let averageTurnaroundTime = 0;
    if (signedWithTimestamps.length > 0) {
      const totalTurnaroundTime = signedWithTimestamps.reduce((sum, contract) => {
        const turnaroundTime = contract.signedAt!.getTime() - contract.sentAt!.getTime();
        return sum + turnaroundTime;
      }, 0);
      averageTurnaroundTime = totalTurnaroundTime / signedWithTimestamps.length;
    }

    // Convert milliseconds to days
    const averageTurnaroundDays = averageTurnaroundTime / (1000 * 60 * 60 * 24);

    // Monthly breakdown
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      monthEnd.setHours(23, 59, 59, 999);

      const monthContracts = contracts.filter(c => 
        c.createdAt >= monthStart && c.createdAt <= monthEnd
      );

      const monthSigned = monthContracts.filter(c => c.status === 'SIGNED').length;
      const monthSent = monthContracts.filter(c => c.status === 'SENT').length;

      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        contracts: monthContracts.length,
        signed: monthSigned,
        sent: monthSent,
        conversionRate: monthSent > 0 ? (monthSigned / monthSent) * 100 : 0
      });
    }

    // Status distribution
    const statusDistribution = {
      draft: draftContracts,
      sent: sentContracts,
      signed: signedContracts,
      expired: expiredContracts
    };

    // Recent activity (last 7 days)
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    
    const recentActivity = contracts.filter(c => c.createdAt >= weekStart).map(contract => ({
      id: contract.id,
      title: contract.title,
      status: contract.status,
      createdAt: contract.createdAt,
      client: contract.client ? `${contract.client.firstName} ${contract.client.lastName}` : null,
      company: contract.client?.company || null
    }));

    // Top clients by contract count
    const clientStats = contracts.reduce((acc, contract) => {
      if (contract.client) {
        const clientKey = `${contract.client.firstName} ${contract.client.lastName}`;
        if (!acc[clientKey]) {
          acc[clientKey] = {
            name: clientKey,
            company: contract.client.company,
            totalContracts: 0,
            signedContracts: 0
          };
        }
        acc[clientKey].totalContracts++;
        if (contract.status === 'SIGNED') {
          acc[clientKey].signedContracts++;
        }
      }
      return acc;
    }, {} as Record<string, any>);

    const topClients = Object.values(clientStats)
      .sort((a: any, b: any) => b.totalContracts - a.totalContracts)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalContracts,
          signedContracts,
          sentContracts,
          draftContracts,
          expiredContracts,
          conversionRate: Math.round(conversionRate * 100) / 100,
          averageTurnaroundDays: Math.round(averageTurnaroundDays * 100) / 100
        },
        monthlyData,
        statusDistribution,
        recentActivity,
        topClients,
        period: days
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics'
    }, { status: 500 });
  }
}
