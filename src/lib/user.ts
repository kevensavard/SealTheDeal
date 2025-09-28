import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  try {
    // Try to get user from database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    // If user doesn't exist in database, create them
    if (!user) {
      // Get user data from Clerk
      const clerkUserData = await currentUser();
      
      if (clerkUserData) {
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email: clerkUserData.emailAddresses[0]?.emailAddress || '',
            firstName: clerkUserData.firstName || null,
            lastName: clerkUserData.lastName || null,
          }
        });
      }
    }

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
