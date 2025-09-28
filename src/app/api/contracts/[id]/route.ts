import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { withRateLimit } from '@/lib/rateLimit';
import { createContractNotification } from '@/lib/notifications';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const contract = await prisma.contract.findFirst({
      where: {
        id: id,
        userId: dbUser.id,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
          }
        }
      }
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, contract });
  } catch (error) {
    console.error('Error fetching contract:', error);
    return NextResponse.json({ error: 'Failed to fetch contract' }, { status: 500 });
  }
}

async function handlePut(request: Request) {
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

    const body = await request.json();
    const { title, content, status, expiresAt } = body;

    // Check if contract exists and belongs to user
    const existingContract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        userId: dbUser.id,
      },
    });

    if (!existingContract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // Update contract
    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(status && { status }),
        ...(expiresAt && { expiresAt: new Date(expiresAt) }),
        ...(status === 'SENT' && { sentAt: new Date() }),
        ...(status === 'SIGNED' && { signedAt: new Date() }),
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
          }
        }
      }
    });

    // Create notification for status changes
    if (status && status !== existingContract.status) {
      try {
        await createContractNotification(
          user.id,
          updatedContract.id,
          status === 'SENT' ? 'CONTRACT_SENT' :
          status === 'SIGNED' ? 'CONTRACT_SIGNED' :
          status === 'EXPIRED' ? 'CONTRACT_EXPIRED' :
          status === 'CANCELLED' ? 'CONTRACT_CANCELLED' :
          'CONTRACT_CREATED',
          updatedContract.title,
          updatedContract.client ? `${updatedContract.client.firstName} ${updatedContract.client.lastName}` : undefined
        );
      } catch (error) {
        console.error('Error creating status notification:', error);
        // Don't fail the update if notification fails
      }
    }

    return NextResponse.json({ success: true, contract: updatedContract });
  } catch (error) {
    console.error('Error updating contract:', error);
    return NextResponse.json({ error: 'Failed to update contract' }, { status: 500 });
  }
}

async function handleDelete(request: Request) {
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

    // Check if contract exists and belongs to user
    const existingContract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        userId: dbUser.id,
      },
    });

    if (!existingContract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // Delete contract
    await prisma.contract.delete({
      where: { id: contractId },
    });

    return NextResponse.json({ success: true, message: 'Contract deleted successfully' });
  } catch (error) {
    console.error('Error deleting contract:', error);
    return NextResponse.json({ error: 'Failed to delete contract' }, { status: 500 });
  }
}

export const PUT = withRateLimit(handlePut, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 20, // 20 requests per window
  keyGenerator: (req) => {
    const url = new URL(req.url);
    const contractId = url.pathname.split('/')[3];
    return `contracts:${contractId}`;
  }
});

export const DELETE = withRateLimit(handleDelete, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 requests per window
  keyGenerator: (req) => {
    const url = new URL(req.url);
    const contractId = url.pathname.split('/')[3];
    return `contracts:${contractId}`;
  }
});
