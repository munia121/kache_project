import redis from '../config/redis';

const OTP_PREFIX = 'otp:';

/**
 * Generate Redis key for OTP
 */
export const getOtpKey = (email: string): string => {
  return `${OTP_PREFIX}${email.trim().toLowerCase()}`;
};

/**
 * Save OTP in Redis with TTL (default: 180 seconds / 3 minutes)
 */
export const saveOtp = async (
  email: string,
  code: string,
  ttlSeconds: number = 180
): Promise<void> => {
  const key = getOtpKey(email);
  await redis.set(key, code, 'EX', ttlSeconds);
};

/**
 * Retrieve OTP from Redis
 */
export const getOtp = async (email: string): Promise<string | null> => {
  const key = getOtpKey(email);
  return await redis.get(key);
};

/**
 * Delete OTP from Redis
 */
export const deleteOtp = async (email: string): Promise<void> => {
  const key = getOtpKey(email);
  await redis.del(key);
};
