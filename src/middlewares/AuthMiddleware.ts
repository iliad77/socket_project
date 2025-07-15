import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";

export function AuthMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {
        const authHeader = request.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token)
            return response.status(400).json({ msg: "you dont have access" });
        const decode = jwt.verify(token, process.env.SECRET_TOKEN!);
        (request as any).user = decode;
        next();
    } catch (error) {
        if ((error as any).name === "TokenExpiredError")
            return response.status(400).json({ msg: "jwt token has expired" });
    }
}
