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
    const { title, description, steps, expected, actual, browser, device, severity } = body;

    // Validate required fields
    if (!title || !description || !steps || !expected || !actual) {
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

    // Create bug report
    const bugReport = await prisma.supportTicket.create({
      data: {
        userId: dbUser.id,
        type: 'BUG_REPORT',
        title: `Bug: ${title}`,
        description: description,
        priority: severity || 'medium',
        status: 'OPEN',
        userEmail: dbUser.email,
        userName: `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim() || 'User',
        metadata: {
          bugDetails: {
            stepsToReproduce: steps,
            expectedBehavior: expected,
            actualBehavior: actual,
            browser: browser || 'Unknown',
            device: device || 'Unknown',
            severity: severity || 'medium',
            reportedAt: new Date().toISOString()
          }
        }
      }
    });

    // Create notification for user
    await prisma.notification.create({
      data: {
        type: 'SUPPORT_TICKET_CREATED',
        title: 'Bug Report Submitted',
        message: `Your bug report "${title}" has been submitted. Our development team will investigate and get back to you soon.`,
        userId: dbUser.id,
        metadata: {
          ticketId: bugReport.id,
          ticketType: 'BUG_REPORT'
        }
      }
    });

    // In a real application, you would:
    // 1. Send email to development team
    // 2. Create issue in bug tracking system (Jira, GitHub Issues, etc.)
    // 3. Send confirmation email to user
    // 4. Auto-assign to appropriate team based on severity

    console.log('Bug report submitted:', {
      ticketId: bugReport.id,
      user: dbUser.email,
      title,
      severity,
      browser,
      device
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Bug report submitted successfully',
      ticketId: bugReport.id
    });

  } catch (error) {
    console.error('Error creating bug report:', error);
    return NextResponse.json({ 
      error: 'Failed to submit bug report' 
    }, { status: 500 });
  }
}
