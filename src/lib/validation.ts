import { NextRequest } from 'next/server';

export interface ValidationErrorItem {
  field: string;
  message: string;
}

export class ValidationError extends Error {
  constructor(public errors: ValidationErrorItem[]) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateRequired(value: any, fieldName: string): string | null {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateMinLength(value: string, minLength: number, fieldName: string): string | null {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return null;
}

export function validateMaxLength(value: string, maxLength: number, fieldName: string): string | null {
  if (value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters long`;
  }
  return null;
}

export function validateContractData(data: any): void {
  const errors: ValidationErrorItem[] = [];

  // Validate required fields
  if (!data.type) {
    errors.push({ field: 'type', message: 'Contract type is required' });
  }

  if (!data.description) {
    errors.push({ field: 'description', message: 'Contract description is required' });
  }

  // Define contract types that allow single party
  const singlePartyTypes = [
    'NDA', 
    'Non-Disclosure Agreement', 
    'Confidentiality Agreement', 
    'Privacy Policy', 
    'Terms of Service', 
    'Disclaimer', 
    'Waiver',
    'Liability Waiver',
    'Release Form',
    'Consent Form',
    'Authorization Form',
    'Code of Conduct',
    'Acceptable Use Policy',
    'Data Processing Agreement',
    'Cookie Policy',
    'Refund Policy',
    'Return Policy'
  ];
  
  // Check if this is a single-party contract type
  const isSinglePartyType = singlePartyTypes.some(type => 
    data.type.toLowerCase().includes(type.toLowerCase())
  );

  const minParties = isSinglePartyType ? 1 : 2;
  const errorMessage = isSinglePartyType 
    ? 'At least one party is required' 
    : 'At least two parties are required';

  if (!data.parties || !Array.isArray(data.parties) || data.parties.length < minParties) {
    errors.push({ field: 'parties', message: errorMessage });
  }

  // Validate parties array
  if (data.parties && Array.isArray(data.parties)) {
    data.parties.forEach((party: string, index: number) => {
      if (!party || party.trim().length === 0) {
        errors.push({ field: `parties[${index}]`, message: 'Party name cannot be empty' });
      }
      if (party && party.length > 100) {
        errors.push({ field: `parties[${index}]`, message: 'Party name must be less than 100 characters' });
      }
    });
  }

  // Validate optional fields
  if (data.title && data.title.length > 200) {
    errors.push({ field: 'title', message: 'Contract title must be less than 200 characters' });
  }

  if (data.description && data.description.length > 2000) {
    errors.push({ field: 'description', message: 'Contract description must be less than 2000 characters' });
  }

  if (data.paymentTerms && data.paymentTerms.length > 1000) {
    errors.push({ field: 'paymentTerms', message: 'Payment terms must be less than 1000 characters' });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
}

export function validateClientData(data: any): void {
  const errors: ValidationErrorItem[] = [];

  // Validate required fields
  if (!data.firstName) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  if (!data.lastName) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  }

  // Validate field lengths
  if (data.firstName && data.firstName.length > 50) {
    errors.push({ field: 'firstName', message: 'First name must be less than 50 characters' });
  }

  if (data.lastName && data.lastName.length > 50) {
    errors.push({ field: 'lastName', message: 'Last name must be less than 50 characters' });
  }

  if (data.company && data.company.length > 100) {
    errors.push({ field: 'company', message: 'Company name must be less than 100 characters' });
  }

  // Validate email format
  if (data.email && !validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Validate phone format if provided
  if (data.phone && !validatePhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number format' });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
}

export function validateNotificationData(data: any): void {
  const errors: ValidationErrorItem[] = [];

  if (!data.type) {
    errors.push({ field: 'type', message: 'Notification type is required' });
  }

  if (!data.title) {
    errors.push({ field: 'title', message: 'Notification title is required' });
  }

  if (!data.message) {
    errors.push({ field: 'message', message: 'Notification message is required' });
  }

  if (data.title && data.title.length > 200) {
    errors.push({ field: 'title', message: 'Notification title must be less than 200 characters' });
  }

  if (data.message && data.message.length > 1000) {
    errors.push({ field: 'message', message: 'Notification message must be less than 1000 characters' });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
}

export async function parseAndValidateJSON(req: NextRequest): Promise<any> {
  try {
    const body = await req.json();
    return body;
  } catch (error) {
    throw new ValidationError([{ field: 'body', message: 'Invalid JSON format' }]);
  }
}
