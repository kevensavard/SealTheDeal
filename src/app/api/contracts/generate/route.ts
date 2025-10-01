import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { monitoringService } from '@/lib/monitoring';

// Debug: Check if API key is loaded
console.log('OpenAI API Key loaded:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const startTime = Date.now();
  
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found in environment variables');
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        details: 'Please check your environment variables'
      }, { status: 500 });
    }

    const body = await request.json();
    const { title, type, parties, description, paymentTerms, deadline, specialClauses } = body;

    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create a comprehensive prompt for OpenAI
    let specificDetails = '';
    
    if (type === 'Car Sale') {
      specificDetails = `
Vehicle Details:
- Make: ${body.carMake || 'Not specified'}
- Model: ${body.carModel || 'Not specified'}
- Year: ${body.carYear || 'Not specified'}
- Mileage: ${body.carMileage || 'Not specified'} ${body.carMileageUnit || 'miles'}
- VIN: ${body.carVin || 'Not provided'}
- Condition: ${body.carCondition || 'Not specified'}

Important: This is a private sale between individuals. Include "as-is" clause and proper disclaimers for private vehicle sales.`;
    } else if (type === 'Property Rental') {
      specificDetails = `
Property Details:
- Address: ${body.propertyAddress || 'Not specified'}
- Type: ${body.propertyType || 'Not specified'}
- Rent: ${body.rentAmount || 'Not specified'}
- Period: ${body.rentPeriod || 'Monthly'}
- Security Deposit: ${body.securityDeposit || 'Not specified'}

Important: Include standard rental terms, maintenance responsibilities, and tenant/landlord obligations.`;
    } else if (type === 'Equipment Lease') {
      specificDetails = `
Equipment Details:
- Description: ${body.equipmentDescription || 'Not specified'}
- Serial Number: ${body.equipmentSerialNumber || 'Not provided'}
- Lease Term: ${body.leaseTerm || 'Not specified'}
- Amount: ${body.leaseAmount || 'Not specified'}

Important: Include equipment condition, maintenance responsibilities, and return conditions.`;
    }

    // Check if this is a single-party contract
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
    const isSinglePartyType = singlePartyTypes.some(singleType => 
      type.toLowerCase().includes(singleType.toLowerCase())
    );

    const prompt = `Generate a comprehensive, professional, legally-sound ${type.toLowerCase()} contract that reads like a real legal document. This should be detailed, thorough, and include all necessary legal protections and clauses.

Contract Details:
- Type: ${type}
- Parties: ${Array.isArray(parties) ? parties.filter(p => p.trim()).join(', ') : parties || 'Parties to be specified'}
- Description: ${description || 'Service description to be specified'}
- Payment Terms: ${paymentTerms || 'Payment terms to be specified'}
- Deadline: ${deadline ? new Date(deadline).toLocaleDateString() : 'Timeline to be specified'}
- Special Clauses: ${specialClauses.length > 0 ? specialClauses.join(', ') : 'Standard terms apply'}
- Date: ${currentDate}
${specificDetails}

${isSinglePartyType ? 'IMPORTANT: This is a single-party contract. Structure it appropriately for one party (e.g., NDA, Privacy Policy, Terms of Service).' : ''}

Generate a comprehensive contract that includes ALL of the following sections in detail:

**1. CONTRACT HEADER**
- Professional title based on the contract type and details
- Contract number/identifier
- Effective date and execution date
- Full legal names and addresses of all parties

**2. RECITALS/WHEREAS CLAUSES**
- Background and purpose of the agreement
- Each party's role and authority
- Legal capacity and authority to enter agreement

**3. DEFINITIONS**
- Define all key terms used throughout the contract
- Technical terms, industry-specific language
- Clear definitions to avoid ambiguity

**4. SCOPE OF WORK/SUBJECT MATTER**
- Detailed description of services, goods, or property
- Specific deliverables, specifications, and requirements
- Quality standards and performance metrics
- Timeline and milestones

**5. COMPENSATION AND PAYMENT TERMS**
- Detailed payment structure and amounts
- Payment schedule and due dates
- Late payment penalties and interest
- Currency, method of payment, and invoicing
- Tax obligations and responsibilities

**6. TERM AND TERMINATION**
- Contract duration and renewal terms
- Termination conditions and procedures
- Notice requirements for termination
- Consequences of termination (payment, return of materials, etc.)

**7. OBLIGATIONS AND RESPONSIBILITIES**
- Detailed obligations of each party
- Performance standards and requirements
- Compliance with laws and regulations
- Insurance and liability requirements

**8. INTELLECTUAL PROPERTY RIGHTS**
- Ownership of work product and deliverables
- License grants and restrictions
- Confidentiality and non-disclosure obligations
- Protection of proprietary information

**9. WARRANTIES AND REPRESENTATIONS**
- Warranties of authority and capacity
- Quality and performance warranties
- Compliance with applicable laws
- Truth and accuracy of information provided

**10. INDEMNIFICATION AND LIMITATION OF LIABILITY**
- Indemnification clauses protecting each party
- Limitation of liability and damages
- Insurance requirements
- Exclusions and exceptions

**11. DISPUTE RESOLUTION**
- Governing law and jurisdiction
- Dispute resolution procedures (mediation, arbitration, litigation)
- Venue and choice of law
- Attorney fees and costs

**12. GENERAL PROVISIONS**
- Entire agreement clause
- Amendment and modification procedures
- Assignment and delegation rights
- Severability clause
- Force majeure provisions
- Notices and communications
- Waiver of rights
- Survival of terms

**13. EXECUTION AND SIGNATURES**
- Signature blocks for all parties
- Date and place of execution
- Witness requirements (if applicable)
- Notarization requirements (if applicable)

**SPECIAL REQUIREMENTS BY CONTRACT TYPE:**

${type === 'Car Sale' ? `
**CAR SALE SPECIFIC CLAUSES:**
- Vehicle identification and specifications
- "As-is" condition disclaimer with detailed exclusions
- Odometer disclosure and accuracy
- Title transfer procedures and timing
- Registration and insurance requirements
- Warranty disclaimers and limitations
- Inspection rights and procedures
- Risk of loss and insurance
- Compliance with state vehicle laws
- Lemon law disclosures
- Recall information and obligations
` : ''}

${type === 'Property Rental' ? `
**PROPERTY RENTAL SPECIFIC CLAUSES:**
- Detailed property description and condition
- Use restrictions and permitted activities
- Maintenance and repair responsibilities
- Utilities and services included/excluded
- Security deposit terms and return procedures
- Rent increase procedures and limitations
- Entry rights and notice requirements
- Subletting and assignment restrictions
- Pet policies and restrictions
- Compliance with housing laws and regulations
- Eviction procedures and grounds
` : ''}

${type === 'Equipment Lease' ? `
**EQUIPMENT LEASE SPECIFIC CLAUSES:**
- Detailed equipment specifications and condition
- Installation, setup, and training requirements
- Maintenance and service obligations
- Insurance and risk of loss
- Use restrictions and prohibited activities
- Return conditions and procedures
- Purchase options and procedures
- Upgrade and modification rights
- Compliance with safety regulations
- Environmental and disposal requirements
` : ''}

${type === 'Freelance' || type === 'Service Agreement' || type === 'Consulting' ? `
**SERVICE AGREEMENT SPECIFIC CLAUSES:**
- Detailed scope of services and deliverables
- Performance standards and quality requirements
- Timeline, milestones, and project phases
- Change order procedures and pricing
- Intellectual property ownership and licensing
- Confidentiality and non-compete obligations
- Independent contractor status and tax implications
- Equipment and materials provision
- Communication and reporting requirements
- Acceptance criteria and approval processes
` : ''}

${type === 'Employment' ? `
**EMPLOYMENT SPECIFIC CLAUSES:**
- Position, duties, and responsibilities
- Compensation, benefits, and expense reimbursement
- Work schedule and location requirements
- Confidentiality and non-disclosure obligations
- Non-compete and non-solicitation restrictions
- Intellectual property assignment
- Termination procedures and severance
- Dispute resolution and arbitration
- Compliance with employment laws
- Background check and drug testing policies
` : ''}

${type === 'Partnership' ? `
**PARTNERSHIP SPECIFIC CLAUSES:**
- Partnership structure and governance
- Capital contributions and profit/loss sharing
- Management responsibilities and decision-making
- Partnership property and asset ownership
- Admission and withdrawal of partners
- Dissolution and winding up procedures
- Buy-sell agreements and valuation methods
- Non-compete and non-solicitation obligations
- Confidentiality and fiduciary duties
- Dispute resolution and mediation procedures
` : ''}

Make this contract comprehensive, professional, and legally robust. Use formal legal language while maintaining clarity. Include specific details, dates, amounts, and procedures. This should be a contract that could actually be used in a real business transaction.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // ⚡ Fast, latest GPT-4 variant
      messages: [
        {
          role: "system",
          content: "You are a professional contract lawyer with expertise in drafting comprehensive, legally-sound contracts. Generate detailed, professional contracts that include all necessary legal protections and clauses. Use formal legal language while maintaining clarity. Include specific details, dates, amounts, and procedures. Make contracts comprehensive and legally robust."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000, // Reduced for faster generation
      temperature: 0.2, // Lower temperature for more consistent, professional output
    });

    const contractContent = completion.choices[0]?.message?.content || '';

    if (!contractContent) {
      throw new Error('No content generated from OpenAI');
    }

    // Generate a meaningful title if none provided
    let generatedTitle = title;
    if (!title || title.trim() === '') {
      const titleCompletion = await openai.chat.completions.create({
        model: "gpt-4o", // Use same model for consistency
        messages: [
          {
            role: "system",
            content: "You are a professional contract lawyer. Generate a concise, professional contract title based on the contract content. The title should be 3-8 words and clearly describe the type of agreement. Examples: 'Freelance Web Development Agreement', 'Car Sale Contract', 'Property Rental Agreement', 'Equipment Lease Contract'."
          },
          {
            role: "user",
            content: `Based on this contract content, generate a professional title:\n\nContract Type: ${type}\nDescription: ${description}\nParties: ${parties?.join(', ') || 'Not specified'}\n\nContract Content:\n${contractContent.substring(0, 500)}...`
          }
        ],
        max_tokens: 50,
        temperature: 0.3,
      });

      generatedTitle = titleCompletion.choices[0]?.message?.content?.trim() || 'Contract Agreement';
      
      // Clean up the title (remove quotes, extra spaces, etc.)
      generatedTitle = generatedTitle.replace(/^["']|["']$/g, '').trim();
    }

    console.log('✅ Contract generated successfully with OpenAI');

    // Record successful generation metrics
    const responseTime = Date.now() - startTime;
    monitoringService.recordMetrics({
      responseTime,
      requestCount: 1,
      errorCount: 0,
    });

    monitoringService.logEvent('contract_generated', {
      contractType: type,
      responseTime,
      success: true,
    });

    return NextResponse.json({ 
      success: true, 
      content: contractContent,
      title: generatedTitle
    });

  } catch (error) {
    console.error('Error generating contract with OpenAI:', error);
    
    // Record error metrics
    const responseTime = Date.now() - startTime;
    monitoringService.recordMetrics({
      responseTime,
      requestCount: 1,
      errorCount: 1,
    });

    monitoringService.logError(error as Error, {
      endpoint: '/api/contracts/generate',
      timestamp: new Date(),
    });
    
    // Fallback to basic contract if OpenAI fails
    const body = await request.json();
    const { title, type, parties, description, paymentTerms, deadline, specialClauses } = body;
    
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const fallbackContent = `
# ${title || 'Contract Agreement'}

**Contract Type:** ${type}
**Date:** ${currentDate}

---

## Parties

This agreement is entered into between ${parties || 'the parties specified below'}.

---

## Scope of Work

${description || 'The scope of work will be defined based on the requirements specified by the client.'}

---

## Payment Terms

${paymentTerms || 'Payment terms will be specified based on the agreed-upon deliverables and timeline.'}

---

## Timeline

${deadline ? `This contract shall be completed by ${new Date(deadline).toLocaleDateString()}.` : 'Timeline will be specified based on project requirements.'}

---

## Special Clauses

${specialClauses.length > 0 
  ? specialClauses.map((clause: string) => `• ${clause}`).join('\n')
  : 'Standard terms and conditions apply.'
}

---

## Terms and Conditions

1. **Confidentiality:** Both parties agree to maintain confidentiality of all proprietary information.

2. **Intellectual Property:** All work products and intellectual property created under this agreement shall be owned by the client unless otherwise specified.

3. **Termination:** Either party may terminate this agreement with 30 days written notice.

4. **Dispute Resolution:** Any disputes shall be resolved through binding arbitration in accordance with the laws of the jurisdiction.

5. **Governing Law:** This agreement shall be governed by the laws of the state of [State], United States.

6. **Entire Agreement:** This contract constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements.

---

## Signatures

By signing below, both parties agree to the terms and conditions outlined in this contract.

**Client Signature:**

_________________________          Date: _______________
${parties?.split(' and ')[0] || 'Client Name'}

**Service Provider Signature:**

_________________________          Date: _______________
${parties?.split(' and ')[1] || 'Service Provider Name'}

---

*This contract was generated using SealTheDeal AI Contract Generator.*
    `.trim();

    return NextResponse.json({ 
      success: true, 
      content: fallbackContent,
      warning: 'OpenAI generation failed, using fallback template'
    });
  }
}
