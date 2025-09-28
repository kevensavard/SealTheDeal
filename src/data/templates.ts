import { Template, TemplateCategory } from '@/types/template';

export const templateCategories: TemplateCategory[] = [
  {
    id: 'business',
    name: 'Business',
    description: 'Professional business contracts',
    icon: '🏢'
  },
  {
    id: 'freelance',
    name: 'Freelance',
    description: 'Freelancer and contractor agreements',
    icon: '💼'
  },
  {
    id: 'legal',
    name: 'Legal',
    description: 'Legal protection and compliance',
    icon: '⚖️'
  },
  {
    id: 'property',
    name: 'Property',
    description: 'Real estate and property agreements',
    icon: '🏠'
  }
];

export const templates: Template[] = [
  {
    id: 'freelance-web-dev',
    name: 'Freelance Web Development',
    description: 'Complete web development project agreement with milestones, deliverables, and payment terms.',
    category: 'freelance',
    icon: '💻',
    fields: {
      type: 'Freelance',
      parties: ['Client Name - Client', 'Developer Name - Freelancer'],
      description: 'Web development services including frontend and backend development, database design, and deployment. Project includes responsive design, user authentication, and admin dashboard.',
      paymentTerms: '$5,000 total - 50% upfront, 50% on completion',
      deadline: '',
      specialClauses: ['Intellectual Property Rights', 'Confidentiality Agreement', 'Change Order Procedures']
    },
    preview: 'Professional freelance web development contract with detailed scope, payment terms, and intellectual property clauses.'
  },
  {
    id: 'nda-agreement',
    name: 'Non-Disclosure Agreement',
    description: 'Protect confidential information with a comprehensive NDA template.',
    category: 'legal',
    icon: '🔒',
    fields: {
      type: 'NDA',
      parties: ['Disclosing Party', 'Receiving Party'],
      description: 'Mutual non-disclosure agreement to protect confidential business information, trade secrets, and proprietary data.',
      paymentTerms: '',
      deadline: '',
      specialClauses: ['Confidentiality Agreement', 'Non-compete Clause', 'Intellectual Property Rights', 'Dispute Resolution']
    },
    preview: 'Comprehensive NDA protecting confidential information with clear definitions, obligations, and remedies.'
  },
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    description: 'General service agreement template for various business services.',
    category: 'business',
    icon: '🤝',
    fields: {
      type: 'Service Agreement',
      parties: ['Service Provider', 'Client'],
      description: 'General service agreement covering service delivery, quality standards, and client obligations.',
      paymentTerms: 'Net 30 days',
      deadline: '',
      specialClauses: ['Service Level Agreement', 'Termination Clauses', 'Liability Limitations']
    },
    preview: 'Professional service agreement with clear service definitions, quality standards, and payment terms.'
  },
  {
    id: 'partnership-agreement',
    name: 'Partnership Agreement',
    description: 'Comprehensive partnership agreement for business partnerships.',
    category: 'business',
    icon: '👥',
    fields: {
      type: 'Partnership',
      parties: ['Partner 1', 'Partner 2'],
      description: 'Business partnership agreement covering profit sharing, decision-making, and partnership governance.',
      paymentTerms: 'Equal profit sharing',
      deadline: '',
      specialClauses: ['Partnership Structure', 'Decision Making Process', 'Buy-Sell Agreement', 'Dispute Resolution']
    },
    preview: 'Comprehensive partnership agreement with governance structure, profit sharing, and exit strategies.'
  },
  {
    id: 'car-sale',
    name: 'Car Sale Agreement',
    description: 'Private vehicle sale agreement with as-is clauses and proper disclaimers.',
    category: 'property',
    icon: '🚗',
    fields: {
      type: 'Car Sale',
      parties: ['Seller Name - Seller', 'Buyer Name - Buyer'],
      description: 'Private vehicle sale between individuals with as-is condition and proper legal disclaimers.',
      paymentTerms: 'Cash payment upon delivery',
      deadline: '',
      specialClauses: ['As-Is Sale (for vehicles/goods)', 'Title Transfer', 'Odometer Disclosure'],
      carMake: 'Toyota',
      carModel: 'Camry',
      carYear: '2020',
      carMileage: '50000',
      carMileageUnit: 'miles',
      carVin: '',
      carCondition: 'Good'
    },
    preview: 'Private car sale agreement with vehicle details, as-is condition, and proper legal protections.'
  },
  {
    id: 'property-rental',
    name: 'Property Rental Agreement',
    description: 'Residential property rental agreement with tenant and landlord obligations.',
    category: 'property',
    icon: '🏠',
    fields: {
      type: 'Property Rental',
      parties: ['Landlord Name - Landlord', 'Tenant Name - Tenant'],
      description: 'Residential property rental agreement covering rent, security deposit, and property maintenance.',
      paymentTerms: '$1,500/month',
      deadline: '',
      specialClauses: ['Property Maintenance', 'Entry Rights', 'Pet Policy'],
      propertyAddress: '123 Main Street, City, State',
      propertyType: 'Apartment',
      rentAmount: '$1,500/month',
      rentPeriod: 'Monthly',
      securityDeposit: '$1,500'
    },
    preview: 'Comprehensive rental agreement with property details, rent terms, and tenant/landlord responsibilities.'
  },
  {
    id: 'equipment-lease',
    name: 'Equipment Lease Agreement',
    description: 'Equipment leasing agreement for business equipment and machinery.',
    category: 'business',
    icon: '⚙️',
    fields: {
      type: 'Equipment Lease',
      parties: ['Lessor Name - Equipment Owner', 'Lessee Name - Equipment User'],
      description: 'Equipment lease agreement covering equipment use, maintenance, and return conditions.',
      paymentTerms: '$500/month',
      deadline: '',
      specialClauses: ['Equipment Maintenance', 'Return Conditions', 'Insurance Requirements'],
      equipmentDescription: 'Industrial equipment and machinery',
      equipmentSerialNumber: '',
      leaseTerm: '12 months',
      leaseAmount: '$500/month'
    },
    preview: 'Professional equipment lease with maintenance obligations, insurance requirements, and return conditions.'
  },
  {
    id: 'consulting-agreement',
    name: 'Consulting Agreement',
    description: 'Professional consulting services agreement with deliverables and timelines.',
    category: 'freelance',
    icon: '📊',
    fields: {
      type: 'Consulting',
      parties: ['Consultant Name - Consultant', 'Client Name - Client'],
      description: 'Professional consulting services including strategy development, analysis, and recommendations.',
      paymentTerms: '$200/hour or $5,000 project fee',
      deadline: '',
      specialClauses: ['Confidentiality Agreement', 'Intellectual Property Rights', 'Independent Contractor Status']
    },
    preview: 'Professional consulting agreement with clear deliverables, payment terms, and intellectual property clauses.'
  }
];
