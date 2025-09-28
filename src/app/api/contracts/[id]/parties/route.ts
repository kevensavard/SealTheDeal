import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await currentUser();

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { parties } = body;

    if (!parties || !Array.isArray(parties)) {
      return NextResponse.json({ error: 'Parties data is required' }, { status: 400 });
    }

    // Check if contract exists and belongs to user
    const contract = await prisma.contract.findFirst({
      where: {
        id: id,
        userId: dbUser.id,
      },
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // Process parties data
    const processedParties = parties.map((party: string) => {
      const [name, role] = party.split(' - ');
      return {
        name: name?.trim() || party.trim(),
        role: role?.trim() || 'party',
        email: '' // Will be filled when sending e-signature
      };
    });

    // Update contract with parties data
    const updatedContract = await prisma.contract.update({
      where: { id: id },
      data: {
        parties: processedParties,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Parties data updated successfully',
      contract: {
        id: updatedContract.id,
        title: updatedContract.title,
        parties: updatedContract.parties,
      }
    });

  } catch (error) {
    console.error('Error updating contract parties:', error);
    return NextResponse.json({ error: 'Failed to update contract parties' }, { status: 500 });
  }
}
