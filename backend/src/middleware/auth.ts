// Fix: Use ES module import for Express types.
// Corrected express import to a default import for proper type resolution.
import express from 'express';
import jwt from 'jsonwebtoken';

// Fix: Redefined AuthRequest as an interface extending Request to resolve an issue with property inheritance from Express's Request type.
// Fix: Changed to extend express.Request to avoid type conflicts.
// Fix: Switched from an interface to a type alias with an intersection to resolve property inheritance issues from express.Request.
export type AuthRequest = express.Request & {
  user?: { userId: string; role: string };
};

// Fix: Added explicit types for middleware arguments.
// Fix: Used express.Response and express.NextFunction types.
export const authMiddleware = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
