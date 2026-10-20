import { Division, District, Area } from '@prisma/client';
import prisma from '../../config/prismaClient';
import { IDistrictFilterOptions, IAreaFilterOptions } from './location.interface';

/**
 * Get all divisions sorted by name ascending
 */
export const getAllDivisions = async (): Promise<Division[]> => {
  return await prisma.division.findMany({
    orderBy: {
      name: 'asc',
    },
  });
};

/**
 * Get districts with optional divisionId filter, sorted by name ascending
 */
export const getDistricts = async (
  filters: IDistrictFilterOptions = {}
): Promise<District[]> => {
  return await prisma.district.findMany({
    where: {
      ...(filters.divisionId ? { divisionId: filters.divisionId } : {}),
    },
    orderBy: {
      name: 'asc',
    },
  });
};

/**
 * Get areas with optional districtId filter, sorted by name ascending
 */
export const getAreas = async (
  filters: IAreaFilterOptions = {}
): Promise<Area[]> => {
  return await prisma.area.findMany({
    where: {
      ...(filters.districtId ? { districtId: filters.districtId } : {}),
    },
    orderBy: {
      name: 'asc',
    },
  });
};

export const LocationService = {
  getAllDivisions,
  getDistricts,
  getAreas,
};

export default LocationService;
