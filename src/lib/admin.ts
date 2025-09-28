import { prisma } from './prisma';
import { UserTier } from '@prisma/client';

// Server-side admin check (for API routes and server components)
export async function isAdminServer(clerkId?: string): Promise<boolean> {
  if (!clerkId) return false;
  
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { tier: true }
    });
    
    return user?.tier === UserTier.ADMIN;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Server-side tier check
export async function getUserTier(clerkId?: string): Promise<UserTier | null> {
  if (!clerkId) return null;
  
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { tier: true }
    });
    
    return user?.tier || null;
  } catch (error) {
    console.error('Error getting user tier:', error);
    return null;
  }
}

// Server-side function to set user tier
export async function setUserTier(clerkId: string, tier: UserTier): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { clerkId },
      data: { tier }
    });
    return true;
  } catch (error) {
    console.error('Error setting user tier:', error);
    return false;
  }
}

// Client-side admin check (for React components) - this will need to be updated to use an API call
export function isAdminClient(clerkId?: string): boolean {
  // This is a temporary fallback - in a real app, you'd make an API call to check the user's tier
  // For now, we'll return false and let the server-side checks handle it
  return false;
}
