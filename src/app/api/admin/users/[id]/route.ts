import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { isAdminServer } from '@/lib/admin';
import { UserTier } from '@prisma/client';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = await isAdminServer(user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
  }

  try {
    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            contracts: true,
            clients: true
          }
        }
      }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get additional stats
    const lastContract = await prisma.contract.findFirst({
      where: { userId: targetUser.id },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const contractsThisMonth = await prisma.contract.count({
      where: {
        userId: targetUser.id,
        createdAt: { gte: startOfMonth }
      }
    });

    const userWithStats = {
      id: targetUser.id,
      clerkId: targetUser.clerkId,
      email: targetUser.email,
      firstName: targetUser.firstName,
      lastName: targetUser.lastName,
      tier: targetUser.tier,
      createdAt: targetUser.createdAt,
      updatedAt: targetUser.updatedAt,
      lastActivity: lastContract?.createdAt || targetUser.updatedAt,
      contractCount: targetUser._count.contracts,
      clientCount: targetUser._count.clients,
      contractsThisMonth
    };

    return NextResponse.json({
      success: true,
      user: userWithStats
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json({
      error: 'Failed to fetch user',
      details: error.message
    }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
    const { tier, firstName, lastName } = body;

    // Validate tier if provided
    if (tier && !Object.values(UserTier).includes(tier)) {
      return NextResponse.json({ 
        error: 'Invalid tier. Must be FREE, PRO, or ADMIN' 
      }, { status: 400 });
    }

    // Build update data
    const updateData: any = {};
    if (tier !== undefined) updateData.tier = tier;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      include: {
        _count: {
          select: {
            contracts: true,
            clients: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        clerkId: updatedUser.clerkId,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        tier: updatedUser.tier,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        contractCount: updatedUser._count.contracts,
        clientCount: updatedUser._count.clients
      }
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({
      error: 'Failed to update user',
      details: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = await isAdminServer(user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
  }

  try {
    // Prevent admin from deleting themselves
    if (user.id === params.id) {
      return NextResponse.json({ 
        error: 'Cannot delete your own account' 
      }, { status: 400 });
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: params.id }
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete user (this will cascade delete contracts, clients, etc.)
    await prisma.user.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({
      error: 'Failed to delete user',
      details: error.message
    }, { status: 500 });
  }
}
