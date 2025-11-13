import { Request, Response, NextFunction } from 'express';

const AUTH_TOKEN = '123auth';

export const authenticateSimpleToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  if (token !== AUTH_TOKEN) {
    return res.status(403).json({ error: 'Invalid token' });
  }

  next();
};
