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
    const { title, description, useCase, priority, category } = body;

    // Validate required fields
    if (!title || !description || !useCase) {
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

    // Create feature request
    const featureRequest = await prisma.supportTicket.create({
      data: {
        userId: dbUser.id,
        type: 'FEATURE_REQUEST',
        title: `Feature: ${title}`,
        description: description,
        priority: priority || 'medium',
        status: 'OPEN',
        userEmail: dbUser.email,
        userName: `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim() || 'User',
        metadata: {
          featureDetails: {
            useCase: useCase,
            category: category || 'general',
            priority: priority || 'medium',
            requestedAt: new Date().toISOString(),
            userTier: dbUser.tier
          }
        }
      }
    });

    // Create notification for user
    await prisma.notification.create({
      data: {
        type: 'SUPPORT_TICKET_CREATED',
        title: 'Feature Request Submitted',
        message: `Your feature request "${title}" has been submitted. Thank you for helping us improve SealTheDeal!`,
        userId: dbUser.id,
        metadata: {
          ticketId: featureRequest.id,
          ticketType: 'FEATURE_REQUEST'
        }
      }
    });

    // In a real application, you would:
    // 1. Send email to product team
    // 2. Create feature request in product management tool (Aha!, Productboard, etc.)
    // 3. Send confirmation email to user
    // 4. Add to feature voting/prioritization system

    console.log('Feature request submitted:', {
      ticketId: featureRequest.id,
      user: dbUser.email,
      title,
      category,
      priority,
      userTier: dbUser.tier
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Feature request submitted successfully',
      ticketId: featureRequest.id
    });

  } catch (error) {
    console.error('Error creating feature request:', error);
    return NextResponse.json({ 
      error: 'Failed to submit feature request' 
    }, { status: 500 });
  }
}
