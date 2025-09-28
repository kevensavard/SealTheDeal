import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { backupService } from '@/lib/backup';
import { isAdminServer } from '@/lib/admin';

export async function POST(request: Request) {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = await isAdminServer(user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const options = body.options || {};
    
    const backupPath = await backupService.createBackup(options);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Backup created successfully',
      backupPath 
    });
  } catch (error: any) {
    console.error('Error creating backup:', error);
    return NextResponse.json({ 
      error: 'Failed to create backup',
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isAdmin = await isAdminServer(user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
  }

  try {
    const backups = await backupService.listBackups();
    return NextResponse.json({ 
      success: true, 
      backups 
    });
  } catch (error: any) {
    console.error('Error listing backups:', error);
    return NextResponse.json({ 
      error: 'Failed to list backups',
      details: error.message 
    }, { status: 500 });
  }
}
