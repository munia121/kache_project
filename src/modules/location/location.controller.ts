import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import validateUUID from '../../utils/validateUUID';
import LocationService from './location.service';

/**
 * Get all divisions sorted by name
 * GET /api/locations/divisions
 */
export const getAllDivisions = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const divisions = await LocationService.getAllDivisions();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Divisions retrieved successfully',
      data: divisions,
    });
  }
);

/**
 * Get districts (optionally filtered by divisionId)
 * GET /api/locations/districts?divisionId=<UUID>
 */
export const getDistricts = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const rawDivisionId = req.query.divisionId;
    let divisionId: string | undefined;

    if (
      rawDivisionId &&
      typeof rawDivisionId === 'string' &&
      rawDivisionId.trim() !== ''
    ) {
      divisionId = validateUUID(rawDivisionId, 'divisionId');
    }

    const districts = await LocationService.getDistricts({ divisionId });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Districts retrieved successfully',
      data: districts,
    });
  }
);

/**
 * Get areas (optionally filtered by districtId)
 * GET /api/locations/areas?districtId=<UUID>
 */
export const getAreas = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const rawDistrictId = req.query.districtId;
    let districtId: string | undefined;

    if (
      rawDistrictId &&
      typeof rawDistrictId === 'string' &&
      rawDistrictId.trim() !== ''
    ) {
      districtId = validateUUID(rawDistrictId, 'districtId');
    }

    const areas = await LocationService.getAreas({ districtId });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Areas retrieved successfully',
      data: areas,
    });
  }
);

export const LocationController = {
  getAllDivisions,
  getDistricts,
  getAreas,
};

export default LocationController;
