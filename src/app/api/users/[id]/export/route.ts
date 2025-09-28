import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { DataExport } from '@/lib/backup';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify user owns the data they're trying to export
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user || user.id !== id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const userData = await DataExport.exportUserData(id);

    return NextResponse.json({ 
      success: true, 
      data: userData 
    });
  } catch (error) {
    console.error('Error exporting user data:', error);
    return NextResponse.json({ 
      error: 'Failed to export user data',
      details: error.message 
    }, { status: 500 });
  }
}
