import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { createContractNotification } from '@/lib/notifications';
import { validateContractData, parseAndValidateJSON, ValidationError } from '@/lib/validation';
import { withRateLimit } from '@/lib/rateLimit';
import { checkContractLimit } from '@/lib/contractLimits';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');

    if (!clerkId) {
      return NextResponse.json({ error: 'Missing clerkId parameter' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's contracts with signature progress
    const contracts = await prisma.contract.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10, // Limit to 10 most recent contracts
      include: {
        signers: {
          select: {
            id: true,
            signerName: true,
            signerEmail: true,
            role: true,
            signedAt: true,
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      contracts: contracts 
    });

  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch contracts',
      details: error.message 
    }, { status: 500 });
  }
}

async function handlePost(request: Request) {
  try {
    const body = await parseAndValidateJSON(request);
    const { title, type, parties, description, paymentTerms, deadline, specialClauses, generatedContent, clerkId } = body;

    if (!clerkId) {
      return NextResponse.json({ error: 'Missing clerkId' }, { status: 400 });
    }

    // Check contract limits before creating
    const limitInfo = await checkContractLimit(clerkId);
    if (!limitInfo.canCreate) {
      return NextResponse.json({ 
        error: 'Contract limit exceeded', 
        details: limitInfo.message,
        limitInfo: {
          currentCount: limitInfo.currentCount,
          limit: limitInfo.limit,
          resetDate: limitInfo.resetDate
        }
      }, { status: 403 });
    }

    // Validate contract data
    validateContractData({ title, type, parties, description, paymentTerms, deadline, specialClauses });

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Process parties data
    const processedParties = parties ? parties.map((party: string) => {
      const [name, role] = party.split(' - ');
      return {
        name: name?.trim() || party.trim(),
        role: role?.trim() || 'party',
        email: '' // Will be filled when sending e-signature
      };
    }) : [];

    // Create new contract
    const contract = await prisma.contract.create({
      data: {
        title: title || 'Untitled Contract',
        content: generatedContent || '',
        status: 'DRAFT',
        userId: user.id,
        parties: processedParties,
      }
    });

    // Create notification for contract creation
    try {
      await createContractNotification(
        user.id,
        contract.id,
        'CONTRACT_CREATED',
        contract.title
      );
    } catch (error) {
      console.error('Error creating contract notification:', error);
      // Don't fail the contract creation if notification fails
    }

    console.log('✅ Contract created:', contract.id);

    return NextResponse.json({ 
      success: true, 
      contract: contract,
      message: 'Contract saved successfully'
    });

  } catch (error) {
    console.error('Error creating contract:', error);
    
    if (error instanceof ValidationError) {
      return NextResponse.json({ 
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create contract',
      details: error.message 
    }, { status: 500 });
  }
}

export const POST = withRateLimit(handlePost, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 requests per window
  keyGenerator: (req) => {
    const clerkId = new URL(req.url).searchParams.get('clerkId');
    return `contracts:${clerkId || 'anonymous'}`;
  }
});
