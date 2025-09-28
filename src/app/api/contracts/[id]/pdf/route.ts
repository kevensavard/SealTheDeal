import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { withRateLimit } from '@/lib/rateLimit';

async function handleGet(request: Request) {
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

    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        userId: dbUser.id,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
            email: true,
          }
        },
        signers: {
          where: {
            signedAt: {
              not: null
            }
          }
        }
      }
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // Generate PDF content (simplified version - in production you'd use a proper PDF library)
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${contract.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #333; }
          .content { font-size: 14px; color: #555; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666; }
          .signature-section { margin-top: 50px; }
          .signature-line { border-bottom: 1px solid #333; width: 300px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${contract.title}</div>
          ${contract.client ? `<div>Client: ${contract.client.firstName} ${contract.client.lastName}${contract.client.company ? ` (${contract.client.company})` : ''}</div>` : ''}
          <div>Date: ${new Date(contract.createdAt).toLocaleDateString()}</div>
        </div>
        
        <div class="content">
          ${contract.content.replace(/\n/g, '<br>')}
        </div>
        
        <div class="signature-section">
          <h3>Signatures</h3>
          ${contract.parties && Array.isArray(contract.parties) ? 
            contract.parties.map((party: any, index: number) => {
              // Find the signed signature for this party
              const signedSignature = contract.signers?.find(signer => 
                signer.signerName === party.name && signer.signedAt
              );
              
              return `
                <div style="margin-top: ${index > 0 ? '30px' : '0'};">
                  <p><strong>${party.role === 'contractor' ? 'Contractor' : 
                            party.role === 'client' ? 'Client' : 
                            party.role === 'seller' ? 'Seller' : 
                            party.role === 'buyer' ? 'Buyer' : 
                            party.role} Signature:</strong> ${party.name}</p>
                  ${signedSignature ? `
                    <div style="margin: 20px 0;">
                      <div style="border: 2px solid #333; background: white; padding: 10px; width: 500px; height: 150px; display: flex; align-items: center; justify-content: center;">
                        <img src="${signedSignature.signatureData}" alt="Digital Signature" style="width: 100%; height: 100%; object-fit: contain; background: white;" />
                      </div>
                      <p><strong>Signed by:</strong> ${signedSignature.signerName}</p>
                      <p><strong>Email:</strong> ${signedSignature.signerEmail}</p>
                      <p><strong>Date:</strong> ${signedSignature.signedAt ? new Date(signedSignature.signedAt).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>Time:</strong> ${signedSignature.signatureTime || 'N/A'}</p>
                      <p><strong>Location:</strong> ${signedSignature.signatureLocation || 'N/A'}</p>
                    </div>
                  ` : `
                    <div class="signature-line"></div>
                    <p>Date: _______________</p>
                  `}
                </div>
              `;
            }).join('') : `
              <div>
                <p>Contractor Signature:</p>
                <div class="signature-line"></div>
                <p>Date: _______________</p>
              </div>
              ${contract.client ? `
              <div style="margin-top: 30px;">
                <p>Client Signature:</p>
                <div class="signature-line"></div>
                <p>Date: _______________</p>
              </div>
              ` : ''}
            `}
        </div>
        
        <div class="footer">
          <p>Contract ID: ${contract.id}</p>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `;

    // Return HTML content that can be converted to PDF on the frontend
    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${contract.title.replace(/[^a-z0-9]/gi, '_')}.html"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

export const GET = withRateLimit(handleGet, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 20, // 20 requests per window
  keyGenerator: (req) => {
    const url = new URL(req.url);
    const contractId = url.pathname.split('/')[3];
    return `pdf:${contractId}`;
  }
});
