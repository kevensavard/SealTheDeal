import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
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
    // Get total users
    const totalUsers = await prisma.user.count();

    // Get active users (users who have created at least one contract or have been active recently)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = await prisma.user.count({
      where: {
        OR: [
          {
            contracts: {
              some: {
                createdAt: {
                  gte: thirtyDaysAgo
                }
              }
            }
          },
          {
            updatedAt: {
              gte: thirtyDaysAgo
            }
          }
        ]
      }
    });

    // Get users by tier
    const proUsers = await prisma.user.count({
      where: { tier: 'PRO' }
    });
    
    const adminUsers = await prisma.user.count({
      where: { tier: 'ADMIN' }
    });

    // Get contract statistics
    const totalContracts = await prisma.contract.count();
    const contractsThisMonth = await prisma.contract.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    const stats = {
      totalUsers,
      activeUsers,
      proUsers,
      adminUsers,
      freeUsers: totalUsers - proUsers - adminUsers,
      totalContracts,
      contractsThisMonth
    };

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error: any) {
    console.error('Error fetching user statistics:', error);
    return NextResponse.json({
      error: 'Failed to fetch user statistics',
      details: error.message
    }, { status: 500 });
  }
}
