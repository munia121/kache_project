import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';

/**
 * Hash a plain password string using bcryptjs
 * @param password Plain text password
 * @returns Promise<string> Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare plain password with stored hash
 * @param password Plain text password
 * @param hash Stored bcrypt hash
 * @returns Promise<boolean> True if match, false otherwise
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate a JWT token using payload and secret from environment/config
 * @param payload Object containing user details to encode in JWT
 * @param expiresIn Optional token expiration string (e.g. '7d', '1d', '24h')
 * @returns string Signed JWT token
 */
export const generateToken = (
  payload: object,
  expiresIn: string | number = config.jwt_expires_in || '7d'
): string => {
  const secret = (process.env.JWT_SECRET || config.jwt_secret) as string;
  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };
  return jwt.sign(payload, secret, options);
};

/**
 * Generate an Access Token
 */
export const generateAccessToken = (
  payload: object,
  expiresIn: string | number = config.jwt_expires_in || '7d'
): string => {
  return generateToken(payload, expiresIn);
};

/**
 * Generate a Refresh Token
 */
export const generateRefreshToken = (
  payload: object,
  expiresIn: string | number = config.jwt_refresh_expires_in || '30d'
): string => {
  const secret = (process.env.JWT_REFRESH_SECRET || config.jwt_refresh_secret) as string;
  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };
  return jwt.sign(payload, secret, options);
};

/**
 * Verify a Refresh Token
 */
export const verifyRefreshToken = (token: string): any => {
  const secret = (process.env.JWT_REFRESH_SECRET || config.jwt_refresh_secret) as string;
  return jwt.verify(token, secret);
};

/**
 * Verify a JWT token
 * @param token JWT token string
 * @returns Decoded payload
 */
export const verifyJwtToken = (token: string): any => {
  const secret = (process.env.JWT_SECRET || config.jwt_secret) as string;
  return jwt.verify(token, secret);
};

export default {
  hashPassword,
  comparePassword,
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyJwtToken,
};
