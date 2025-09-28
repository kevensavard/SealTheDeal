import { prisma } from './prisma';

export type NotificationType = 
  | 'CONTRACT_CREATED'
  | 'CONTRACT_SENT'
  | 'CONTRACT_SIGNED'
  | 'CONTRACT_EXPIRED'
  | 'CONTRACT_EXPIRING_SOON'
  | 'CONTRACT_CANCELLED'
  | 'CLIENT_ADDED'
  | 'SIGNATURE_REMINDER'
  | 'SYSTEM_ALERT';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  contractId?: string;
  clientId?: string;
  metadata?: any;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  contractId,
  clientId,
  metadata
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        userId,
        contractId: contractId || null,
        clientId: clientId || null,
        metadata: metadata || null
      }
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

// Helper function to create contract-related notifications
export async function createContractNotification(
  userId: string,
  contractId: string,
  type: NotificationType,
  contractTitle: string,
  clientName?: string
) {
  const messages = {
    CONTRACT_CREATED: `New contract "${contractTitle}" has been created${clientName ? ` for ${clientName}` : ''}`,
    CONTRACT_SENT: `Contract "${contractTitle}" has been sent for signature${clientName ? ` to ${clientName}` : ''}`,
    CONTRACT_SIGNED: `Contract "${contractTitle}" has been signed${clientName ? ` by ${clientName}` : ''}`,
    CONTRACT_EXPIRED: `Contract "${contractTitle}" has expired`,
    CONTRACT_EXPIRING_SOON: `Contract "${contractTitle}" is expiring soon`,
    CONTRACT_CANCELLED: `Contract "${contractTitle}" has been cancelled`,
    CLIENT_ADDED: `New client "${clientName}" has been added to your contacts`,
    SIGNATURE_REMINDER: `Reminder: Contract "${contractTitle}" is waiting for signature${clientName ? ` from ${clientName}` : ''}`,
    SYSTEM_ALERT: `System alert for contract "${contractTitle}"`
  };

  const titles = {
    CONTRACT_CREATED: 'Contract Created',
    CONTRACT_SENT: 'Contract Sent',
    CONTRACT_SIGNED: 'Contract Signed',
    CONTRACT_EXPIRED: 'Contract Expired',
    CONTRACT_EXPIRING_SOON: 'Contract Expiring Soon',
    CONTRACT_CANCELLED: 'Contract Cancelled',
    CLIENT_ADDED: 'New Client Added',
    SIGNATURE_REMINDER: 'Signature Reminder',
    SYSTEM_ALERT: 'System Alert'
  };

  return createNotification({
    userId,
    type,
    title: titles[type],
    message: messages[type],
    contractId,
    metadata: { contractTitle, clientName }
  });
}

// Helper function to create client-related notifications
export async function createClientNotification(
  userId: string,
  clientId: string,
  clientName: string
) {
  return createNotification({
    userId,
    type: 'CLIENT_ADDED',
    title: 'New Client Added',
    message: `New client "${clientName}" has been added to your contacts`,
    clientId,
    metadata: { clientName }
  });
}

// Function to check for expiring contracts and create notifications
export async function checkExpiringContracts() {
  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const expiringContracts = await prisma.contract.findMany({
      where: {
        expiresAt: {
          lte: threeDaysFromNow,
          gte: new Date()
        },
        status: {
          in: ['DRAFT', 'SENT']
        }
      },
      include: {
        user: true,
        client: true
      }
    });

    for (const contract of expiringContracts) {
      // Check if we already have an expiring notification for this contract
      const existingNotification = await prisma.notification.findFirst({
        where: {
          contractId: contract.id,
          type: 'CONTRACT_EXPIRING_SOON'
        }
      });

      if (!existingNotification) {
        await createContractNotification(
          contract.userId,
          contract.id,
          'CONTRACT_EXPIRING_SOON',
          contract.title,
          contract.client ? `${contract.client.firstName} ${contract.client.lastName}` : undefined
        );
      }
    }

    return expiringContracts.length;
  } catch (error) {
    console.error('Error checking expiring contracts:', error);
    throw error;
  }
}
