export interface SenderData {
  name: string;
  phone: string;
}

export interface RecipientData {
  name: string;
  street: string;
  provinceId: string;
  provinceName: string;
  regencyId: string;
  regencyName: string;
  districtId: string;
  districtName: string;
  villageId: string;
  villageName: string;
}

export type ServiceType = 'REGULAR' | 'EXPRESS';

export interface PackageData {
  weightKg: number;
  description: string;
  service: ServiceType;
}
