import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clerkId, email, firstName, lastName } = body;

    if (!clerkId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists in database
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkId }
    });

    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        message: 'User already exists',
        user: existingUser 
      });
    }

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        clerkId: clerkId,
        email: email,
        firstName: firstName || null,
        lastName: lastName || null,
      }
    });

    console.log('✅ User created in database:', newUser.id, newUser.email);

    return NextResponse.json({ 
      success: true, 
      message: 'User created successfully',
      user: newUser 
    });

  } catch (error) {
    console.error('❌ Error syncing user:', error);
    return NextResponse.json({ 
      error: 'Failed to sync user',
      details: error.message 
    }, { status: 500 });
  }
}
