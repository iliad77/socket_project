import { NextFunction, Request, Response } from "express";

export function IDmiddleware(
    request: Request,
    response: Response,
    next: NextFunction
) {
    try {
        const id = parseInt(request.params.id);
        if (isNaN(id))
            return response.status(400).json({ msg: "invalid type of id" });
        (request as any).parsedID = id;
        next();
    } catch (error) {
        return response.json(error);
    }
}
