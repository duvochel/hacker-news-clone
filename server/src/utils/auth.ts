import { Request } from "express";
import jwt from 'jsonwebtoken';

export const APP_SECRET = 'GraphQL-is-aw3some';

export interface AuthTokenPayload {
  userId: string;
}

export function getTokenPayload(token: string) {
  return jwt.verify(token, APP_SECRET) as AuthTokenPayload;
}

export function getUserId(req?: any, authToken?: string) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  // throw new Error('Not authenticated');
  // allow non-authenticated users
  return undefined;
}
