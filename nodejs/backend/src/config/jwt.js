import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'AuraBuyFullStackSecretKeyForJWTSigningMustBe256BitsLong!!';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'AuraBuyRefreshTokenSecretKeyForJWTSigningMustBe256BitsLong!!';
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

/**
 * Generate Access Token for a user
 * @param {string} email 
 * @param {string} role 
 * @returns {string} token
 */
export const generateAccessToken = (email, role) => {
  return jwt.sign({ email, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
};

/**
 * Generate Refresh Token for a user
 * @param {string} email 
 * @param {string} role 
 * @returns {string} token
 */
export const generateRefreshToken = (email, role) => {
  return jwt.sign({ email, role }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION,
  });
};

/**
 * Verify Access Token
 * @param {string} token 
 * @returns {object|null} payload if valid, null otherwise
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Verify Refresh Token
 * @param {string} token 
 * @returns {object|null} payload if valid, null otherwise
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};
