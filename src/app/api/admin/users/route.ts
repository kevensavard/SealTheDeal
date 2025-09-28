import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const tier = searchParams.get('tier') || '';

    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (tier) {
      where.tier = tier;
    }

    // Get users with contract counts
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            contracts: true,
            clients: true
          }
        }
      }
    });

    // Get total count for pagination
    const totalUsers = await prisma.user.count({ where });

    // Get additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Get last activity (most recent contract or user update)
        const lastContract = await prisma.contract.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true }
        });

        const lastActivity = lastContract?.createdAt || user.updatedAt;

        // Get contracts this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const contractsThisMonth = await prisma.contract.count({
          where: {
            userId: user.id,
            createdAt: { gte: startOfMonth }
          }
        });

        return {
          id: user.id,
          clerkId: user.clerkId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          tier: user.tier,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastActivity,
          contractCount: user._count.contracts,
          clientCount: user._count.clients,
          contractsThisMonth
        };
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      pagination: {
        page,
        limit,
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({
      error: 'Failed to fetch users',
      details: error.message
    }, { status: 500 });
  }
}
