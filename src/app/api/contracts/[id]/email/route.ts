import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { withRateLimit } from '@/lib/rateLimit';

async function handlePost(request: Request) {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Extract contract ID from URL
    const url = new URL(request.url);
    const contractId = url.pathname.split('/')[3];

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        userId: dbUser.id,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
            email: true,
          }
        }
      }
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const body = await request.json();
    const { recipientEmail, message } = body;

    if (!recipientEmail) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    // Update contract status to SENT and set sentAt timestamp
    await prisma.contract.update({
      where: { id: contractId },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    // In a real application, you would integrate with an email service like SendGrid, AWS SES, etc.
    // For now, we'll simulate the email sending
    console.log('Email would be sent:', {
      to: recipientEmail,
      subject: `Contract: ${contract.title}`,
      body: message || `Please review and sign the attached contract: ${contract.title}`,
      contractId: contract.id,
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        type: 'CONTRACT_SENT',
        title: 'Contract Sent',
        message: `Contract "${contract.title}" has been sent to ${recipientEmail}`,
        userId: dbUser.id,
        contractId: contractId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Contract sent successfully',
      sentTo: recipientEmail,
    });

  } catch (error) {
    console.error('Error sending contract email:', error);
    return NextResponse.json({ error: 'Failed to send contract email' }, { status: 500 });
  }
}

export const POST = withRateLimit(handlePost, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 requests per window
  keyGenerator: (req) => {
    const url = new URL(req.url);
    const contractId = url.pathname.split('/')[3];
    return `email:${contractId}`;
  }
});
