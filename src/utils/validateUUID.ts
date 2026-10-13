import AppError from '../errors/AppError';

/**
 * Standard UUID format validation regex
 */
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Helper to validate UUID string parameter
 */
export const validateUUID = (
  id: string | string[] | undefined,
  fieldName: string = 'id'
): string => {
  const value = Array.isArray(id) ? id[0] : id;
  if (!value || typeof value !== 'string' || !UUID_REGEX.test(value.trim())) {
    throw new AppError(
      400,
      `Invalid ${fieldName} parameter format. Must be a valid UUID string.`
    );
  }
  return value.trim();
};

export default validateUUID;
