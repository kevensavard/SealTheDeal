import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

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

    // Get client
    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: user.id
      },
      include: {
        contracts: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!client) {
      return NextResponse.json({
        success: false,
        error: 'Client not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      client
    });

  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch client'
    }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { clerkId, firstName, lastName, company, email, phone, address, notes } = body;

    if (!clerkId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    if (!firstName || !lastName || !email) {
      return NextResponse.json({
        success: false,
        error: 'First name, last name, and email are required'
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

    // Check if client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    });

    if (!existingClient) {
      return NextResponse.json({
        success: false,
        error: 'Client not found'
      }, { status: 404 });
    }

    // Check if email is being changed and if new email already exists
    if (email !== existingClient.email) {
      const emailExists = await prisma.client.findFirst({
        where: {
          userId: user.id,
          email: email,
          id: { not: params.id }
        }
      });

      if (emailExists) {
        return NextResponse.json({
          success: false,
          error: 'A client with this email already exists'
        }, { status: 409 });
      }
    }

    // Update client
    const client = await prisma.client.update({
      where: { id: params.id },
      data: {
        firstName,
        lastName,
        company: company || null,
        email,
        phone: phone || null,
        address: address || null,
        notes: notes || null
      }
    });

    return NextResponse.json({
      success: true,
      client
    });

  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update client'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

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

    // Check if client exists and belongs to user
    const existingClient = await prisma.client.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    });

    if (!existingClient) {
      return NextResponse.json({
        success: false,
        error: 'Client not found'
      }, { status: 404 });
    }

    // Delete client (contracts will be unlinked due to onDelete: SetNull)
    await prisma.client.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete client'
    }, { status: 500 });
  }
}
