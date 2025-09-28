import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, generatedContent } = body;

    // For now, we'll return a simple text response
    // Later this will integrate with a PDF generation library like jsPDF or Puppeteer
    const pdfContent = generatedContent || 'No contract content available';

    // Create a simple HTML version that can be printed as PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title || 'Contract'}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px;
            }
            h1 { color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
            h2 { color: #555; margin-top: 30px; }
            .signature-section { margin-top: 50px; }
            .signature-line { border-bottom: 1px solid #333; width: 200px; display: inline-block; margin: 0 20px; }
          </style>
        </head>
        <body>
          <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${pdfContent}</pre>
        </body>
      </html>
    `;

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${title || 'contract'}.html"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ 
      error: 'Failed to generate PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
