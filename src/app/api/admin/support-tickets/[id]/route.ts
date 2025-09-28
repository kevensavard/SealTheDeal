import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
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
    const { status, priority } = body;

    // Update ticket
    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            tier: true
          }
        }
      }
    });

    // Create notification for user if status changed
    if (status) {
      await prisma.notification.create({
        data: {
          type: 'SUPPORT_TICKET_UPDATED',
          title: 'Support Ticket Updated',
          message: `Your support ticket "${updatedTicket.title}" status has been updated to ${status}.`,
          userId: updatedTicket.userId,
          metadata: {
            ticketId: updatedTicket.id,
            newStatus: status
          }
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      ticket: updatedTicket 
    });

  } catch (error) {
    console.error('Error updating support ticket:', error);
    return NextResponse.json({ 
      error: 'Failed to update support ticket' 
    }, { status: 500 });
  }
}
