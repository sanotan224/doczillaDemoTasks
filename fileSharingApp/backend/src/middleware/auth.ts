import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

export class MiddlewareAuth {
    constructor() {
    }

    authenticate(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const decoded = jwt.verify(token, 'secret-key');
            req.userId = (decoded as any).userId;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    };
}