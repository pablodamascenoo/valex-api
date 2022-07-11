import { Request, Response } from "express";
import * as paymentsService from "../services/paymentsService.js";

export async function postPayment(req: Request, res: Response) {
    const { cardId, businessId, amount, password } = req.body;

    await paymentsService.createPayment(cardId, password, businessId, amount);
    res.sendStatus(201);
}
