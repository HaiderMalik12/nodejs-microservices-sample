import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendFailResponse } from '@logs/utility/response';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { _id: string };
}
export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    console.error('Authorization header missing or incorrect format');
    return sendFailResponse(req, res, 401, 'Access Denied: No token provided or invalid format');
  }

  try {
    const tokenWithoutBearer = authorizationHeader!.split(' ')[1];

    const requestServiceName = req.headers['request-service'];
    if (requestServiceName === 'ondemand') {
      const verified = jwt.verify(tokenWithoutBearer, process.env.ONDEMAND_JWT_SECRET as string) as JwtPayload;
      req.user = verified as JwtPayload & { _id: string; appId: string };
    }
    else {
      const verified = jwt.verify(tokenWithoutBearer, process.env.DISPATCHER_JWT_SECRET as string) as JwtPayload;
      req.user = verified as JwtPayload & { _id: string; role: string };
    }
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    res.status(401).json({ message: 'Access Denied: Invalid token' });
  }
}
