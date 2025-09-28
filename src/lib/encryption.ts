import { createCipher, createDecipher, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// In production, use environment variables for these keys
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here!'; // Must be 32 characters
const ALGORITHM = 'aes-256-gcm';

export class EncryptionService {
  private key: Buffer;

  constructor() {
    // In production, derive key from password using scrypt
    this.key = Buffer.from(ENCRYPTION_KEY, 'utf8');
  }

  /**
   * Encrypts sensitive data
   */
  encrypt(text: string): string {
    try {
      const iv = randomBytes(16);
      const cipher = createCipher(ALGORITHM, this.key);
      cipher.setAAD(Buffer.from('sealthedeal', 'utf8'));

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      // Combine iv, authTag, and encrypted data
      return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypts sensitive data
   */
  decrypt(encryptedData: string): string {
    try {
      const parts = encryptedData.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      const decipher = createDecipher(ALGORITHM, this.key);
      decipher.setAAD(Buffer.from('sealthedeal', 'utf8'));
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Encrypts sensitive fields in an object
   */
  encryptObject(obj: any, fieldsToEncrypt: string[]): any {
    const encrypted = { ...obj };
    
    for (const field of fieldsToEncrypt) {
      if (encrypted[field] && typeof encrypted[field] === 'string') {
        encrypted[field] = this.encrypt(encrypted[field]);
      }
    }
    
    return encrypted;
  }

  /**
   * Decrypts sensitive fields in an object
   */
  decryptObject(obj: any, fieldsToDecrypt: string[]): any {
    const decrypted = { ...obj };
    
    for (const field of fieldsToDecrypt) {
      if (decrypted[field] && typeof decrypted[field] === 'string') {
        try {
          decrypted[field] = this.decrypt(decrypted[field]);
        } catch (error) {
          console.error(`Failed to decrypt field ${field}:`, error);
          // Keep original value if decryption fails
        }
      }
    }
    
    return decrypted;
  }
}

// Export singleton instance
export const encryptionService = new EncryptionService();

/**
 * Utility functions for specific data types
 */
export const DataProtection = {
  /**
   * Encrypts client contact information
   */
  encryptClientData(clientData: any) {
    const fieldsToEncrypt = ['phone', 'address', 'notes'];
    return encryptionService.encryptObject(clientData, fieldsToEncrypt);
  },

  /**
   * Decrypts client contact information
   */
  decryptClientData(clientData: any) {
    const fieldsToDecrypt = ['phone', 'address', 'notes'];
    return encryptionService.decryptObject(clientData, fieldsToDecrypt);
  },

  /**
   * Encrypts contract content
   */
  encryptContractContent(contract: any) {
    const fieldsToEncrypt = ['content'];
    return encryptionService.encryptObject(contract, fieldsToEncrypt);
  },

  /**
   * Decrypts contract content
   */
  decryptContractContent(contract: any) {
    const fieldsToDecrypt = ['content'];
    return encryptionService.decryptObject(contract, fieldsToDecrypt);
  },

  /**
   * Hash sensitive data for searching (one-way)
   */
  hashForSearch(text: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(text).digest('hex');
  },

  /**
   * Sanitize data for logging (remove sensitive information)
   */
  sanitizeForLogging(obj: any): any {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'phone', 'address', 'ssn', 'creditCard'];
    const sanitized = { ...obj };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
};

/**
 * Database field encryption middleware for Prisma
 */
export const withEncryption = {
  /**
   * Middleware to encrypt data before saving
   */
  beforeSave: (model: string, fieldsToEncrypt: string[]) => {
    return async (params: any, next: any) => {
      if (params.action === 'create' || params.action === 'update') {
        if (params.data) {
          params.data = encryptionService.encryptObject(params.data, fieldsToEncrypt);
        }
      }
      return next(params);
    };
  },

  /**
   * Middleware to decrypt data after reading
   */
  afterRead: (model: string, fieldsToDecrypt: string[]) => {
    return async (params: any, next: any) => {
      const result = await next(params);
      
      if (result && typeof result === 'object') {
        if (Array.isArray(result)) {
          return result.map(item => encryptionService.decryptObject(item, fieldsToDecrypt));
        } else {
          return encryptionService.decryptObject(result, fieldsToDecrypt);
        }
      }
      
      return result;
    };
  }
};
