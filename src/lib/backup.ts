import { prisma } from './prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface BackupOptions {
  includeUsers?: boolean;
  includeContracts?: boolean;
  includeClients?: boolean;
  includeTemplates?: boolean;
  includeNotifications?: boolean;
  encryptBackup?: boolean;
  compressionLevel?: number;
}

export interface BackupMetadata {
  timestamp: Date;
  version: string;
  recordCounts: {
    users: number;
    contracts: number;
    clients: number;
    templates: number;
    notifications: number;
  };
  options: BackupOptions;
  checksum: string;
}

export class BackupService {
  private backupDir: string;

  constructor() {
    this.backupDir = process.env.BACKUP_DIR || './backups';
  }

  /**
   * Creates a complete database backup
   */
  async createBackup(options: BackupOptions = {}): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupId = `backup-${timestamp}`;
    
    try {
      // Ensure backup directory exists
      await this.ensureBackupDirectory();

      const backupData: any = {
        metadata: {
          timestamp: new Date(),
          version: '1.0.0',
          recordCounts: {},
          options,
          checksum: ''
        },
        data: {}
      };

      // Backup users
      if (options.includeUsers !== false) {
        const users = await prisma.user.findMany({
          select: {
            id: true,
            clerkId: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
            updatedAt: true
          }
        });
        backupData.data.users = users;
        backupData.metadata.recordCounts.users = users.length;
      }

      // Backup contracts
      if (options.includeContracts !== false) {
        const contracts = await prisma.contract.findMany({
          include: {
            user: {
              select: {
                id: true,
                clerkId: true,
                email: true
              }
            },
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });
        backupData.data.contracts = contracts;
        backupData.metadata.recordCounts.contracts = contracts.length;
      }

      // Backup clients
      if (options.includeClients !== false) {
        const clients = await prisma.client.findMany({
          include: {
            user: {
              select: {
                id: true,
                clerkId: true,
                email: true
              }
            }
          }
        });
        backupData.data.clients = clients;
        backupData.metadata.recordCounts.clients = clients.length;
      }

      // Backup templates
      if (options.includeTemplates !== false) {
        const templates = await prisma.template.findMany();
        backupData.data.templates = templates;
        backupData.metadata.recordCounts.templates = templates.length;
      }

      // Backup notifications
      if (options.includeNotifications !== false) {
        const notifications = await prisma.notification.findMany({
          include: {
            user: {
              select: {
                id: true,
                clerkId: true,
                email: true
              }
            },
            contract: {
              select: {
                id: true,
                title: true
              }
            },
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        });
        backupData.data.notifications = notifications;
        backupData.metadata.recordCounts.notifications = notifications.length;
      }

      // Calculate checksum
      const crypto = require('crypto');
      const dataString = JSON.stringify(backupData.data);
      backupData.metadata.checksum = crypto.createHash('sha256').update(dataString).digest('hex');

      // Write backup file
      const backupFilePath = join(this.backupDir, `${backupId}.json`);
      await writeFile(backupFilePath, JSON.stringify(backupData, null, 2));

      console.log(`✅ Backup created: ${backupId}`);
      console.log(`📊 Records backed up:`, backupData.metadata.recordCounts);

      return backupFilePath;
    } catch (error) {
      console.error('❌ Backup failed:', error);
      throw new Error(`Backup creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Creates a user-specific backup
   */
  async createUserBackup(userId: string, options: BackupOptions = {}): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupId = `user-backup-${userId}-${timestamp}`;
    
    try {
      await this.ensureBackupDirectory();

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          contracts: options.includeContracts !== false ? true : false,
          clients: options.includeClients !== false ? true : false,
          notifications: options.includeNotifications !== false ? true : false
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const backupData = {
        metadata: {
          timestamp: new Date(),
          version: '1.0.0',
          userId: user.id,
          clerkId: user.clerkId,
          email: user.email,
          recordCounts: {
            contracts: user.contracts?.length || 0,
            clients: user.clients?.length || 0,
            notifications: user.notifications?.length || 0
          },
          options,
          checksum: ''
        },
        data: { user }
      };

      // Calculate checksum
      const crypto = require('crypto');
      const dataString = JSON.stringify(backupData.data);
      backupData.metadata.checksum = crypto.createHash('sha256').update(dataString).digest('hex');

      // Write backup file
      const backupFilePath = join(this.backupDir, `${backupId}.json`);
      await writeFile(backupFilePath, JSON.stringify(backupData, null, 2));

      console.log(`✅ User backup created: ${backupId}`);
      return backupFilePath;
    } catch (error) {
      console.error('❌ User backup failed:', error);
      throw new Error(`User backup creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Lists all available backups
   */
  async listBackups(): Promise<Array<{ filename: string; size: number; created: Date }>> {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      if (!existsSync(this.backupDir)) {
        return [];
      }

      const files = await fs.readdir(this.backupDir);
      const backups = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = join(this.backupDir, file);
          const stats = await fs.stat(filePath);
          
          backups.push({
            filename: file,
            size: stats.size,
            created: stats.birthtime
          });
        }
      }

      return backups.sort((a, b) => b.created.getTime() - a.created.getTime());
    } catch (error) {
      console.error('Error listing backups:', error);
      return [];
    }
  }

  /**
   * Validates backup integrity
   */
  async validateBackup(backupPath: string): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const fs = require('fs').promises;
      const crypto = require('crypto');
      
      const backupContent = await fs.readFile(backupPath, 'utf8');
      const backupData = JSON.parse(backupContent);
      
      const errors: string[] = [];
      
      // Check metadata structure
      if (!backupData.metadata) {
        errors.push('Missing metadata section');
      } else {
        if (!backupData.metadata.timestamp) errors.push('Missing timestamp in metadata');
        if (!backupData.metadata.version) errors.push('Missing version in metadata');
        if (!backupData.metadata.checksum) errors.push('Missing checksum in metadata');
      }

      // Validate checksum
      if (backupData.data) {
        const dataString = JSON.stringify(backupData.data);
        const calculatedChecksum = crypto.createHash('sha256').update(dataString).digest('hex');
        
        if (backupData.metadata?.checksum !== calculatedChecksum) {
          errors.push('Checksum validation failed');
        }
      }

      return {
        valid: errors.length === 0,
        errors
      };
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to read backup file: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }

  /**
   * Schedules automatic backups
   */
  scheduleBackups(interval: 'daily' | 'weekly' | 'monthly' = 'daily'): void {
    const intervals = {
      daily: 24 * 60 * 60 * 1000,    // 24 hours
      weekly: 7 * 24 * 60 * 60 * 1000, // 7 days
      monthly: 30 * 24 * 60 * 60 * 1000 // 30 days
    };

    const ms = intervals[interval];
    
    setInterval(async () => {
      try {
        console.log(`🔄 Starting scheduled ${interval} backup...`);
        await this.createBackup();
        console.log(`✅ Scheduled ${interval} backup completed`);
      } catch (error) {
        console.error(`❌ Scheduled ${interval} backup failed:`, error);
      }
    }, ms);

    console.log(`📅 Scheduled ${interval} backups every ${ms / (24 * 60 * 60 * 1000)} days`);
  }

  /**
   * Ensures backup directory exists
   */
  private async ensureBackupDirectory(): Promise<void> {
    const fs = require('fs').promises;
    
    try {
      await fs.access(this.backupDir);
    } catch {
      await fs.mkdir(this.backupDir, { recursive: true });
      console.log(`📁 Created backup directory: ${this.backupDir}`);
    }
  }

  /**
   * Cleanup old backups (keep only last N backups)
   */
  async cleanupOldBackups(keepCount: number = 10): Promise<void> {
    try {
      const backups = await this.listBackups();
      
      if (backups.length <= keepCount) {
        return;
      }

      const fs = require('fs').promises;
      const backupsToDelete = backups.slice(keepCount);
      
      for (const backup of backupsToDelete) {
        const backupPath = join(this.backupDir, backup.filename);
        await fs.unlink(backupPath);
        console.log(`🗑️ Deleted old backup: ${backup.filename}`);
      }
      
      console.log(`🧹 Cleaned up ${backupsToDelete.length} old backups`);
    } catch (error) {
      console.error('Error cleaning up old backups:', error);
    }
  }
}

// Export singleton instance
export const backupService = new BackupService();

/**
 * Utility functions for data export
 */
export const DataExport = {
  /**
   * Export user data for GDPR compliance
   */
  async exportUserData(userId: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        contracts: {
          include: {
            client: true
          }
        },
        clients: true,
        notifications: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      contracts: user.contracts.map(contract => ({
        id: contract.id,
        title: contract.title,
        status: contract.status,
        createdAt: contract.createdAt,
        updatedAt: contract.updatedAt,
        expiresAt: contract.expiresAt,
        sentAt: contract.sentAt,
        signedAt: contract.signedAt
      })),
      clients: user.clients.map(client => ({
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        company: client.company,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt
      })),
      notifications: user.notifications.map(notification => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
        createdAt: notification.createdAt
      })),
      exportedAt: new Date()
    };
  }
};
