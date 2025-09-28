export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  fields: {
    title?: string;
    type: string;
    parties: string[];
    description: string;
    paymentTerms?: string;
    deadline?: string;
    specialClauses: string[];
    // Car Sale specific fields
    carMake?: string;
    carModel?: string;
    carYear?: string;
    carMileage?: string;
    carMileageUnit?: string;
    carVin?: string;
    carCondition?: string;
    // Property Rental specific fields
    propertyAddress?: string;
    propertyType?: string;
    rentAmount?: string;
    rentPeriod?: string;
    securityDeposit?: string;
    // Equipment Lease specific fields
    equipmentDescription?: string;
    equipmentSerialNumber?: string;
    leaseTerm?: string;
    leaseAmount?: string;
  };
  preview: string;
  isPremium?: boolean;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}
