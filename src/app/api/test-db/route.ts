import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try to get all users
    const users = await prisma.user.findMany();
    
    return Response.json({ 
      success: true, 
      message: 'Database connected successfully',
      userCount: users.length,
      users: users
    });
  } catch (error) {
    console.error('Database test error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
