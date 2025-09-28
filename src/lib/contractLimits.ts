import { prisma } from './prisma';
import { UserTier } from '@prisma/client';

export interface ContractLimitInfo {
  canCreate: boolean;
  currentCount: number;
  limit: number | null; // null means unlimited
  resetDate?: Date;
  message?: string;
}

export async function checkContractLimit(clerkId: string): Promise<ContractLimitInfo> {
  try {
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, tier: true }
    });

    if (!user) {
      return {
        canCreate: false,
        currentCount: 0,
        limit: 0,
        message: 'User not found'
      };
    }

    // ADMIN tier gets unlimited contracts
    if (user.tier === UserTier.ADMIN) {
      return {
        canCreate: true,
        currentCount: 0, // We don't need to count for unlimited
        limit: null, // null means unlimited
        message: 'Admin users have unlimited contracts'
      };
    }

    // PRO tier gets unlimited contracts (for future use)
    if (user.tier === UserTier.PRO) {
      return {
        canCreate: true,
        currentCount: 0,
        limit: null,
        message: 'Pro users have unlimited contracts'
      };
    }

    // FREE tier has 1 contract per month limit
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Count contracts created this month (not current database count)
    // This prevents abuse: users can't create -> delete -> create to bypass limits
    const contractsThisMonth = await prisma.contract.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    const limit = 1; // FREE tier limit
    const canCreate = contractsThisMonth < limit;

    return {
      canCreate,
      currentCount: contractsThisMonth,
      limit,
      resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      message: canCreate 
        ? `You can create ${limit - contractsThisMonth} more contract(s) this month`
        : `You've reached your monthly limit of ${limit} contract(s). Upgrade to Pro for unlimited contracts.`
    };

  } catch (error) {
    console.error('Error checking contract limit:', error);
    return {
      canCreate: false,
      currentCount: 0,
      limit: 0,
      message: 'Error checking contract limits'
    };
  }
}

export async function getContractUsage(clerkId: string): Promise<{
  currentMonth: number;
  limit: number | null;
  tier: UserTier;
  resetDate?: Date;
}> {
  try {
    console.log('🔍 getContractUsage - clerkId:', clerkId);
    
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, tier: true }
    });

    console.log('🔍 getContractUsage - user:', user);

    if (!user) {
      throw new Error('User not found');
    }

    // ADMIN and PRO tiers have unlimited contracts
    if (user.tier === UserTier.ADMIN || user.tier === UserTier.PRO) {
      console.log('✅ getContractUsage - ADMIN/PRO user, returning unlimited');
      return {
        currentMonth: 0,
        limit: null,
        tier: user.tier
      };
    }

    // FREE tier has monthly limit
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const contractsThisMonth = await prisma.contract.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    return {
      currentMonth: contractsThisMonth,
      limit: 1,
      tier: user.tier,
      resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1)
    };

  } catch (error) {
    console.error('Error getting contract usage:', error);
    throw error;
  }
}
