export interface Pet {
  id: string;
  name: string;
  species: "dog" | "cat" | "bird" | "rabbit" | "other";
  breed?: string;
  age: number;
  weight: number;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vaccine {
  id: string;
  petId: string;
  vaccineName: string;
  vaccineType: "rabies" | "distemper" | "parvovirus" | "hepatitis" | "other";
  applicationDate: string;
  expirationDate: string;
  veterinarianName: string;
  clinic: string;
  batchNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePetRequest {
  name: string;
  species: Pet["species"];
  breed?: string;
  age: number;
  weight: number;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
}

export interface CreateVaccineRequest {
  petId: string;
  vaccineName: string;
  vaccineType: Vaccine["vaccineType"];
  applicationDate: string;
  expirationDate: string;
  veterinarianName: string;
  clinic: string;
  batchNumber?: string;
  notes?: string;
}

export interface UpdatePetRequest extends Partial<CreatePetRequest> {}
export interface UpdateVaccineRequest extends Partial<CreateVaccineRequest> {}
