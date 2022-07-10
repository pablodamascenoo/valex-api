import { NextFunction, Request, Response } from "express";

export default function errorHandler(
    error: { status: number; message: any },
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(error);
    if (error.status) return res.status(error.status).send(error.message);

    return res.sendStatus(500);
}
