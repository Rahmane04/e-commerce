export interface Customer {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  landmark?: string;
  notes?: string;
}

export function createCustomer(data: Customer): Customer {
  if (!data.fullName || !data.phone || !data.city || !data.address) {
    throw new Error("Nom, téléphone, ville et adresse sont obligatoires.");
  }
  return { ...data };
}
