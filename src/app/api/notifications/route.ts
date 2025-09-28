import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

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

    // Get notifications for this user
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      include: {
        contract: {
          select: {
            id: true,
            title: true,
            status: true,
            expiresAt: true,
            signedAt: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.id,
        isRead: false
      }
    });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      hasMore: notifications.length === limit
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notifications'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clerkId, type, title, message, contractId, clientId, metadata } = body;

    if (!clerkId || !type || !title || !message) {
      return NextResponse.json({
        success: false,
        error: 'User ID, type, title, and message are required'
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

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        userId: user.id,
        contractId: contractId || null,
        clientId: clientId || null,
        metadata: metadata || null
      },
      include: {
        contract: {
          select: {
            id: true,
            title: true,
            status: true,
            expiresAt: true,
            signedAt: true
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      notification
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create notification'
    }, { status: 500 });
  }
}
