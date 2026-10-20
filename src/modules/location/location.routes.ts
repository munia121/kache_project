import { Router } from 'express';
import { LocationController } from './location.controller';

const router = Router();

// ==========================================
// Public Location Routes (Cascading Dropdown)
// ==========================================

/**
 * @route   GET /api/locations/divisions
 * @desc    Get all divisions sorted by name (public)
 * @access  Public
 */
router.get('/divisions', LocationController.getAllDivisions);

/**
 * @route   GET /api/locations/districts
 * @desc    Get districts, optionally filtered by ?divisionId=<UUID> (public)
 * @access  Public
 */
router.get('/districts', LocationController.getDistricts);

/**
 * @route   GET /api/locations/areas
 * @desc    Get areas, optionally filtered by ?districtId=<UUID> (public)
 * @access  Public
 */
router.get('/areas', LocationController.getAreas);

export const LocationRoutes = router;
export default router;
