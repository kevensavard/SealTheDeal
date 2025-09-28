import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { withRateLimit } from '@/lib/rateLimit';
import { sendContractForSignature } from '@/lib/email';

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
        const { recipientEmail, recipientName, recipientRole, message, password } = body;

    if (!recipientEmail || !recipientName) {
      return NextResponse.json({ error: 'Recipient email and name are required' }, { status: 400 });
    }

        // Generate a unique signing token for this specific party
        const signingToken = `sign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Hash the password if provided
        let passwordHash = null;
        if (password) {
          const crypto = await import('crypto');
          passwordHash = crypto.createHash('sha256').update(password).digest('hex');
        }
        
        // Create a ContractSigner record for this specific party
        const contractSigner = await prisma.contractSigner.create({
          data: {
            contractId: contractId,
            signerName: recipientName,
            signerEmail: recipientEmail,
            role: recipientRole || 'party',
            signatureToken: signingToken,
            passwordHash: passwordHash,
          }
        });
    
    // Generate the signing URL
    const signingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://sealthedeal.app'}/sign/${signingToken}`;
    
    // Send email with signing link
    const emailSent = await sendContractForSignature({
      contractTitle: contract.title,
      contractId: contract.id,
      signerName: recipientName,
      signerEmail: recipientEmail,
      contractUrl: signingUrl,
      message: message,
      password: password,
      senderName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Contract Sender',
      senderEmail: user.emailAddresses[0]?.emailAddress || 'noreply@sealthedeal.app',
    });

    if (!emailSent) {
      console.error('Failed to send email for contract signature');
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
    
    console.log('E-signature request sent:', {
      contractId: contract.id,
      contractTitle: contract.title,
      recipientEmail,
      recipientName,
      signingUrl,
    });

    // Update contract status to SENT if not already
    if (contract.status === 'DRAFT') {
      await prisma.contract.update({
        where: { id: contractId },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });
    }

    // Create notification for the user
    await prisma.notification.create({
      data: {
        type: 'CONTRACT_SENT',
        title: 'E-signature Request Sent',
        message: `E-signature request for "${contract.title}" has been sent to ${recipientEmail}`,
        userId: dbUser.id,
        contractId: contractId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'E-signature request sent successfully',
      sentTo: recipientEmail,
      signingUrl,
      contractId: contract.id,
    });

  } catch (error) {
    console.error('Error sending e-signature request:', error);
    return NextResponse.json({ error: 'Failed to send e-signature request' }, { status: 500 });
  }
}

export const POST = withRateLimit(handlePost, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 requests per window
  keyGenerator: (req) => {
    const url = new URL(req.url);
    const contractId = url.pathname.split('/')[3];
    return `esign:${contractId}`;
  }
});
