import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getLocationFromIP } from '@/lib/geolocation';
import { sendFinalSignedContract } from '@/lib/email';

async function sendFinalContractToAllParties(contractId: string, request: Request) {
  try {
    // Get contract with all signers
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        signers: {
          where: {
            signedAt: {
              not: null
            }
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });

    if (!contract) {
      console.error('Contract not found for final sending:', contractId);
      return;
    }

    // Get the base URL for the PDF endpoint
    const baseUrl = 'https://www.sealthedeal.app';
    const pdfUrl = `${baseUrl}/api/contracts/${contractId}/pdf`;

    // Send to all signers
    const emailPromises = contract.signers.map(async (signer) => {
      try {
        // In a real application, you would integrate with an email service like:
        // - SendGrid, Mailgun, AWS SES, etc.
        
        console.log('Sending final contract to:', {
          to: signer.signerEmail,
          name: signer.signerName,
          contractTitle: contract.title,
          pdfUrl: pdfUrl
        });

        // Send final signed contract email
        const emailSent = await sendFinalSignedContract({
          contractTitle: contract.title,
          contractId: contract.id,
          recipientName: signer.signerName,
          recipientEmail: signer.signerEmail,
          signedPdfUrl: pdfUrl,
          senderName: `${contract.user.firstName || ''} ${contract.user.lastName || ''}`.trim() || 'Contract Owner',
          senderEmail: 'noreply@sealthedeal.app', // You might want to get this from the contract owner
        });

        if (!emailSent) {
          console.error('Failed to send final contract email to', signer.signerEmail);
          return { success: false, email: signer.signerEmail, error: 'Email sending failed' };
        }
        
        return { success: true, email: signer.signerEmail };
      } catch (error) {
        console.error('Error sending final contract to', signer.signerEmail, ':', error);
        return { success: false, email: signer.signerEmail, error };
      }
    });

    // Wait for all emails to be processed
    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log('Final contract sending results:', {
      total: results.length,
      successful: successful.length,
      failed: failed.length,
      failedEmails: failed.map(f => f.email)
    });

    // Create notification for contract owner
    await prisma.notification.create({
      data: {
        type: 'CONTRACT_COMPLETED',
        title: 'Contract Fully Executed',
        message: `Contract "${contract.title}" has been fully signed and sent to all parties. ${successful.length} parties notified successfully.`,
        userId: contract.userId,
        contractId: contractId,
      },
    });

  } catch (error) {
    console.error('Error sending final contract to all parties:', error);
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

        // Find contract signer by signature token
        const contractSigner = await prisma.contractSigner.findFirst({
          where: {
            signatureToken: token,
          },
          include: {
            contract: {
              include: {
                client: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    company: true,
                  }
                },
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  }
                }
              }
            }
          }
        });

        if (!contractSigner) {
          return NextResponse.json({ error: 'Contract not found or token invalid' }, { status: 404 });
        }

        const contract = contractSigner.contract;

        if (!contract) {
          return NextResponse.json({ error: 'Contract not found or token invalid' }, { status: 404 });
        }

        // Check if this specific signer has already signed
        if (contractSigner.signedAt) {
          return NextResponse.json({ error: 'You have already signed this contract' }, { status: 400 });
        }


        // Check if password is required
        if (contractSigner.passwordHash) {
          return NextResponse.json({ error: 'Password required' }, { status: 401 });
        }


    return NextResponse.json({
      id: contract.id,
      title: contract.title,
      content: contract.content,
      status: contract.status,
      createdAt: contract.createdAt,
      client: contract.client,
      user: contract.user,
      signer: {
        name: contractSigner.signerName,
        email: contractSigner.signerEmail,
        role: contractSigner.role,
      }
    });
  } catch (error) {
    console.error('Error fetching contract for signing:', error);
    return NextResponse.json({ error: 'Failed to fetch contract' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
      try {
        const { token } = await params;
        const body = await request.json();
        const { signerName, signerEmail, signatureData, signatureTime, signatureLocation, password } = body;

    // Handle password verification request (no signer info provided)
    if (!signerName && !signerEmail && password !== undefined) {
      // Find contract signer by signature token
      const contractSigner = await prisma.contractSigner.findFirst({
        where: {
          signatureToken: token,
        },
        include: {
          contract: {
            include: {
              client: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  company: true,
                }
              },
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                }
              }
            }
          }
        }
      });

      if (!contractSigner) {
        return NextResponse.json({ error: 'Contract not found or token invalid' }, { status: 404 });
      }

      if (!contractSigner.passwordHash) {
        return NextResponse.json({ error: 'This contract is not password protected' }, { status: 400 });
      }

      const crypto = await import('crypto');
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      
      if (passwordHash !== contractSigner.passwordHash) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }

      // Password is correct, return contract data
      return NextResponse.json({
        id: contractSigner.contract.id,
        title: contractSigner.contract.title,
        content: contractSigner.contract.content,
        status: contractSigner.contract.status,
        createdAt: contractSigner.contract.createdAt,
        client: contractSigner.contract.client,
        user: contractSigner.contract.user,
        signer: {
          name: contractSigner.signerName,
          email: contractSigner.signerEmail,
          role: contractSigner.role,
        }
      });
    }

    // Regular signing request - require signer info
    if (!signerName || !signerEmail) {
      return NextResponse.json({ error: 'Signer name and email are required' }, { status: 400 });
    }

    // Find contract signer by signature token
    const contractSigner = await prisma.contractSigner.findFirst({
      where: {
        signatureToken: token,
      },
      include: {
        contract: true
      }
    });

    if (!contractSigner) {
      return NextResponse.json({ error: 'Contract not found or token invalid' }, { status: 404 });
    }

    // Check if this specific signer has already signed
    if (contractSigner.signedAt) {
      return NextResponse.json({ error: 'You have already signed this contract' }, { status: 400 });
    }

        // Get location from IP address
        const location = await getLocationFromIP(request);
        
        // Update the specific signer's record
        const now = new Date();
        const updatedSigner = await prisma.contractSigner.update({
          where: { id: contractSigner.id },
          data: {
            signedAt: now,
            signatureData: signatureData || null, // Store signature image data if provided
            signatureTime: now.toLocaleTimeString(),
            signatureLocation: location,
          },
        });

    // Check if all signers have signed to update contract status
    const allSigners = await prisma.contractSigner.findMany({
      where: { contractId: contractSigner.contractId }
    });

    const allSigned = allSigners.every(signer => signer.signedAt !== null);

        if (allSigned) {
          // Update contract status to SIGNED when all parties have signed
          await prisma.contract.update({
            where: { id: contractSigner.contractId },
            data: {
              status: 'SIGNED',
              signedAt: new Date(),
            },
          });

          // Send final signed contract to all parties
          await sendFinalContractToAllParties(contractSigner.contractId, request);
        }

        // Create notification for the contract owner
        const roleDisplay = contractSigner.role === 'contractor' ? 'Contractor' : 
                           contractSigner.role === 'client' ? 'Client' : 
                           contractSigner.role === 'seller' ? 'Seller' : 
                           contractSigner.role === 'buyer' ? 'Buyer' : 
                           contractSigner.role;

        await prisma.notification.create({
          data: {
            type: 'CONTRACT_SIGNED',
            title: `${roleDisplay} Signed Contract`,
            message: `${signerName} (${roleDisplay}) has signed "${contractSigner.contract.title}". ${allSigned ? 'All parties have signed - contract is complete!' : 'Waiting for remaining signatures.'}`,
            userId: contractSigner.contract.userId,
            contractId: contractSigner.contractId,
          },
        });

    return NextResponse.json({
      success: true,
      message: 'Contract signed successfully',
      contract: {
        id: contractSigner.contractId,
        title: contractSigner.contract.title,
        status: allSigned ? 'SIGNED' : 'SENT',
        signedAt: updatedSigner.signedAt,
        signer: {
          name: signerName,
          email: signerEmail,
          role: contractSigner.role,
        }
      }
    });
  } catch (error) {
    console.error('Error signing contract:', error);
    return NextResponse.json({ error: 'Failed to sign contract' }, { status: 500 });
  }
}
