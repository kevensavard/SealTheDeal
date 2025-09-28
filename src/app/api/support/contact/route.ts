import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, subject, message, priority } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create support ticket
    const supportTicket = await prisma.supportTicket.create({
      data: {
        userId: dbUser.id,
        type: 'CONTACT',
        title: subject,
        description: message,
        priority: priority || 'medium',
        status: 'OPEN',
        userEmail: email,
        userName: name,
        metadata: {
          originalEmail: email,
          originalName: name,
          priority: priority || 'medium'
        }
      }
    });

    // Create notification for user
    await prisma.notification.create({
      data: {
        type: 'SUPPORT_TICKET_CREATED',
        title: 'Support Request Submitted',
        message: `Your support request "${subject}" has been submitted. We'll get back to you within 24 hours.`,
        userId: dbUser.id,
        metadata: {
          ticketId: supportTicket.id,
          ticketType: 'CONTACT'
        }
      }
    });

    // In a real application, you would:
    // 1. Send email to support team
    // 2. Create ticket in support system (Zendesk, Freshdesk, etc.)
    // 3. Send confirmation email to user

    console.log('Support contact request:', {
      ticketId: supportTicket.id,
      user: dbUser.email,
      subject,
      priority,
      message: message.substring(0, 100) + '...'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Support request submitted successfully',
      ticketId: supportTicket.id
    });

  } catch (error) {
    console.error('Error creating support contact:', error);
    return NextResponse.json({ 
      error: 'Failed to submit support request' 
    }, { status: 500 });
  }
}
