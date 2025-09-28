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
        const email = clerkUserData.emailAddresses[0]?.emailAddress || '';
        
        // Check if user exists by email (for dev to prod migration)
        const existingUserByEmail = await prisma.user.findUnique({
          where: { email: email }
        });

        if (existingUserByEmail) {
          // Update the existing user with the new clerkId
          user = await prisma.user.update({
            where: { id: existingUserByEmail.id },
            data: {
              clerkId: userId,
              firstName: clerkUserData.firstName || existingUserByEmail.firstName,
              lastName: clerkUserData.lastName || existingUserByEmail.lastName,
            }
          });
        } else {
          // Create new user
          user = await prisma.user.create({
            data: {
              clerkId: userId,
              email: email,
              firstName: clerkUserData.firstName || null,
              lastName: clerkUserData.lastName || null,
            }
          });
        }
      }
    }

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
