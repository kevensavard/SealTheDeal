import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    const { id } = await params;
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    });

    if (!dbUser || dbUser.tier !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // For now, we'll use a simple approach with notifications as responses
    // In a real system, you'd have a separate TicketResponse model
    const responses = await prisma.notification.findMany({
      where: {
        type: 'SUPPORT_TICKET_UPDATED',
        metadata: {
          path: ['ticketId'],
          equals: id
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Transform notifications to response format
    const formattedResponses = responses.map(notification => ({
      id: notification.id,
      ticketId: id,
      message: notification.message,
      isAdmin: true, // All responses from this endpoint are admin responses
      createdAt: notification.createdAt.toISOString()
    }));

    return NextResponse.json({ 
      success: true, 
      responses: formattedResponses 
    });

  } catch (error) {
    console.error('Error fetching ticket responses:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch ticket responses' 
    }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    const { id } = await params;
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    });

    if (!dbUser || dbUser.tier !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { message } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get ticket details
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Create notification as response
    const response = await prisma.notification.create({
      data: {
        type: 'SUPPORT_TICKET_UPDATED',
        title: 'Support Response',
        message: message,
        userId: ticket.userId,
        metadata: {
          ticketId: id,
          isResponse: true,
          adminResponse: true
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      response: {
        id: response.id,
        ticketId: id,
        message: message,
        isAdmin: true,
        createdAt: response.createdAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Error creating ticket response:', error);
    return NextResponse.json({ 
      error: 'Failed to create ticket response' 
    }, { status: 500 });
  }
}
