import { Division, District, Area } from '@prisma/client';

export type IDivision = Division;
export type IDistrict = District;
export type IArea = Area;

export interface IDistrictFilterOptions {
  divisionId?: string;
}

export interface IAreaFilterOptions {
  districtId?: string;
}
