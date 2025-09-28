import Mailgun from 'mailgun.js';
import FormData from 'form-data';

// Initialize Mailgun
const mailgun = new Mailgun(FormData);
const mg = process.env.MAILGUN_API_KEY ? mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
}) : null;

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface ContractEmailData {
  contractTitle: string;
  contractId: string;
  signerName: string;
  signerEmail: string;
  contractUrl: string;
  message?: string;
  password?: string;
  senderName: string;
  senderEmail: string;
}

export interface FinalContractEmailData {
  contractTitle: string;
  contractId: string;
  recipientName: string;
  recipientEmail: string;
  signedPdfUrl: string;
  senderName: string;
  senderEmail: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!mg || !process.env.MAILGUN_DOMAIN) {
    console.error('Mailgun not configured');
    return false;
  }

  try {
    const msg = {
      from: options.from || `SealTheDeal <contracts@sealthedeal.app>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    await mg.messages.create(process.env.MAILGUN_DOMAIN, msg);
    console.log('✅ Email sent successfully to:', options.to);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
}

export async function sendContractForSignature(data: ContractEmailData): Promise<boolean> {
  const subject = `Contract for Signature: ${data.contractTitle}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contract for Signature</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #10b981); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #10b981); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        .password-notice { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📝 Contract Ready for Signature</h1>
        <p>You have a contract waiting for your signature</p>
      </div>
      
      <div class="content">
        <h2>Hello ${data.signerName},</h2>
        
        <p><strong>${data.senderName}</strong> has sent you a contract for signature:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">${data.contractTitle}</h3>
          <p style="margin: 0; color: #64748b;">Contract ID: ${data.contractId}</p>
        </div>
        
        ${data.message ? `<p><strong>Message from ${data.senderName}:</strong></p><p style="background: #f1f5f9; padding: 15px; border-radius: 8px; font-style: italic;">"${data.message}"</p>` : ''}
        
        ${data.password ? `
          <div class="password-notice">
            <strong>🔒 Password Protected:</strong> This contract is password protected. You'll need to enter the password when you access the signing page.
          </div>
        ` : ''}
        
        <div style="text-align: center;">
          <a href="${data.contractUrl}" class="button">Sign Contract Now</a>
        </div>
        
        <p><strong>Important:</strong> Please review the contract carefully before signing. Once signed, the contract will be legally binding.</p>
        
        <p>If you have any questions about this contract, please contact ${data.senderName} at <a href="mailto:support@sealthedeal.app">support@sealthedeal.app</a>.</p>
      </div>
      
      <div class="footer">
        <p>This email was sent by SealTheDeal - Professional Contract Management</p>
        <p>If you didn't expect this email, please ignore it or contact the sender.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Contract for Signature: ${data.contractTitle}

Hello ${data.signerName},

${data.senderName} has sent you a contract for signature.

Contract: ${data.contractTitle}
Contract ID: ${data.contractId}

${data.message ? `Message from ${data.senderName}: "${data.message}"` : ''}

${data.password ? 'This contract is password protected. You will need to enter the password when accessing the signing page.' : ''}

To sign the contract, please visit: ${data.contractUrl}

Important: Please review the contract carefully before signing. Once signed, the contract will be legally binding.

If you have any questions, please contact ${data.senderName} at <a href="mailto:support@sealthedeal.app">support@sealthedeal.app</a>.

---
This email was sent by SealTheDeal - Professional Contract Management
  `;

  return await sendEmail({
    to: data.signerEmail,
    subject,
    html,
    text,
  });
}

export async function sendFinalSignedContract(data: FinalContractEmailData): Promise<boolean> {
  const subject = `Signed Contract: ${data.contractTitle}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Signed Contract</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        .success-badge { background: #d1fae5; color: #065f46; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: 600; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ Contract Fully Executed</h1>
        <p>All parties have signed the contract</p>
      </div>
      
      <div class="content">
        <h2>Hello ${data.recipientName},</h2>
        
        <div style="text-align: center;">
          <div class="success-badge">🎉 CONTRACT COMPLETED</div>
        </div>
        
        <p>Great news! The contract has been fully executed by all parties:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #065f46;">${data.contractTitle}</h3>
          <p style="margin: 0; color: #64748b;">Contract ID: ${data.contractId}</p>
        </div>
        
        <p>The final signed contract is now available for download. This document is legally binding and contains all signatures.</p>
        
        <div style="text-align: center;">
          <a href="${data.signedPdfUrl}" class="button">Download Signed Contract</a>
        </div>
        
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Download and save the signed contract for your records</li>
          <li>Share with relevant parties as needed</li>
          <li>Begin fulfilling the terms of the contract</li>
        </ul>
        
        <p>If you have any questions about this contract, please contact ${data.senderName} at <a href="mailto:support@sealthedeal.app">support@sealthedeal.app</a>.</p>
      </div>
      
      <div class="footer">
        <p>This email was sent by SealTheDeal - Professional Contract Management</p>
        <p>Thank you for using our platform!</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Signed Contract: ${data.contractTitle}

Hello ${data.recipientName},

Great news! The contract has been fully executed by all parties.

Contract: ${data.contractTitle}
Contract ID: ${data.contractId}

The final signed contract is now available for download. This document is legally binding and contains all signatures.

Download the signed contract: ${data.signedPdfUrl}

Next Steps:
- Download and save the signed contract for your records
- Share with relevant parties as needed
- Begin fulfilling the terms of the contract

If you have any questions, please contact ${data.senderName} at <a href="mailto:support@sealthedeal.app">support@sealthedeal.app</a>.

---
This email was sent by SealTheDeal - Professional Contract Management
Thank you for using our platform!
  `;

  return await sendEmail({
    to: data.recipientEmail,
    subject,
    html,
    text,
  });
}

export async function sendContractReminder(data: ContractEmailData): Promise<boolean> {
  const subject = `Reminder: Contract Pending Signature - ${data.contractTitle}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contract Reminder</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        .reminder-badge { background: #fef3c7; color: #92400e; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: 600; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>⏰ Contract Signature Reminder</h1>
        <p>Your signature is still pending</p>
      </div>
      
      <div class="content">
        <h2>Hello ${data.signerName},</h2>
        
        <div style="text-align: center;">
          <div class="reminder-badge">📋 SIGNATURE PENDING</div>
        </div>
        
        <p>This is a friendly reminder that you have a contract waiting for your signature:</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #92400e;">${data.contractTitle}</h3>
          <p style="margin: 0; color: #64748b;">Contract ID: ${data.contractId}</p>
        </div>
        
        <p>Please take a moment to review and sign the contract to complete the process.</p>
        
        <div style="text-align: center;">
          <a href="${data.contractUrl}" class="button">Sign Contract Now</a>
        </div>
        
        <p>If you have any questions about this contract, please contact ${data.senderName} at <a href="mailto:support@sealthedeal.app">support@sealthedeal.app</a>.</p>
      </div>
      
      <div class="footer">
        <p>This email was sent by SealTheDeal - Professional Contract Management</p>
        <p>If you have already signed this contract, please ignore this reminder.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Reminder: Contract Pending Signature - ${data.contractTitle}

Hello ${data.signerName},

This is a friendly reminder that you have a contract waiting for your signature.

Contract: ${data.contractTitle}
Contract ID: ${data.contractId}

Please take a moment to review and sign the contract to complete the process.

To sign the contract, please visit: ${data.contractUrl}

If you have any questions, please contact ${data.senderName} at <a href="mailto:support@sealthedeal.app">support@sealthedeal.app</a>.

---
This email was sent by SealTheDeal - Professional Contract Management
If you have already signed this contract, please ignore this reminder.
  `;

  return await sendEmail({
    to: data.signerEmail,
    subject,
    html,
    text,
  });
}
