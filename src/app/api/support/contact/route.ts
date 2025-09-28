import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

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

    // Send email to support team
    const supportEmailSent = await sendEmail({
      to: 'support@sealthedeal.app',
      subject: `[Support Request] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Support Request</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ticket ID:</strong> ${supportTicket.id}</p>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Priority:</strong> ${priority || 'medium'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
            This request was submitted through the SealTheDeal support system.
          </p>
        </div>
      `,
      text: `
New Support Request

Ticket ID: ${supportTicket.id}
From: ${name} (${email})
Priority: ${priority || 'medium'}
Subject: ${subject}

Message:
${message}

This request was submitted through the SealTheDeal support system.
      `
    });

    // Send confirmation email to user
    const confirmationEmailSent = await sendEmail({
      to: email,
      subject: `Support Request Received - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Support Request Received</h2>
          <p>Hello ${name},</p>
          <p>Thank you for contacting SealTheDeal support. We have received your request and will get back to you within 24 hours.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ticket ID:</strong> ${supportTicket.id}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Priority:</strong> ${priority || 'medium'}</p>
          </div>
          <p>If you need immediate assistance, please contact us at <a href="mailto:support@sealthedeal.app">support@sealthedeal.app</a></p>
          <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
            Best regards,<br>
            The SealTheDeal Support Team
          </p>
        </div>
      `,
      text: `
Support Request Received

Hello ${name},

Thank you for contacting SealTheDeal support. We have received your request and will get back to you within 24 hours.

Ticket ID: ${supportTicket.id}
Subject: ${subject}
Priority: ${priority || 'medium'}

If you need immediate assistance, please contact us at support@sealthedeal.app

Best regards,
The SealTheDeal Support Team
      `
    });

    console.log('Support contact request:', {
      ticketId: supportTicket.id,
      user: dbUser.email,
      subject,
      priority,
      supportEmailSent,
      confirmationEmailSent
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
