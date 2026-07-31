import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

export type JwtPayload = {
    userId: number;
    email: string;
    isAdmin: boolean;
};

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ error: "Admin only" });
    }

    next();
}
