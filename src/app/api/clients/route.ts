import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClientNotification } from '@/lib/notifications';

export async function GET(request: Request) {
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

    // Get all clients for this user
    const clients = await prisma.client.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { contracts: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      clients
    });

  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch clients'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    // Check if client with this email already exists for this user
    const existingClient = await prisma.client.findFirst({
      where: {
        userId: user.id,
        email: email
      }
    });

    if (existingClient) {
      return NextResponse.json({
        success: false,
        error: 'A client with this email already exists'
      }, { status: 409 });
    }

    // Create new client
    const client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        company: company || null,
        email,
        phone: phone || null,
        address: address || null,
        notes: notes || null,
        userId: user.id
      }
    });

    // Create notification for client creation
    try {
      await createClientNotification(
        user.id,
        client.id,
        `${client.firstName} ${client.lastName}`
      );
    } catch (error) {
      console.error('Error creating client notification:', error);
      // Don't fail the client creation if notification fails
    }

    return NextResponse.json({
      success: true,
      client
    });

  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create client'
    }, { status: 500 });
  }
}
