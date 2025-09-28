import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clerkId, email, firstName, lastName } = body;

    if (!clerkId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists in database by clerkId first
    let existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkId }
    });

    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        message: 'User already exists',
        user: existingUser 
      });
    }

    // Check if user exists by email (for dev to prod migration)
    existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      // Update the existing user with the new clerkId
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          clerkId: clerkId,
          firstName: firstName || existingUser.firstName,
          lastName: lastName || existingUser.lastName,
        }
      });

      console.log('✅ User updated with new clerkId:', updatedUser.id, updatedUser.email);
      
      return NextResponse.json({ 
        success: true, 
        message: 'User updated with new clerkId',
        user: updatedUser 
      });
    }

    // Create new user in database
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
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
