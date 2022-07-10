import { NextFunction, Request, Response } from "express";
import { findByApiKey } from "../repositories/companyRepository.js";

export async function validateApiKey(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const apiKey = req.headers["x-api-key"].toString();
    const companyFound = await findByApiKey(apiKey);

    if (!companyFound) {
        throw { type: 401, message: "non-authorized api key" };
    }

    next();
}
