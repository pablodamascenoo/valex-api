import { Request, Response } from "express";
import { createRecharge } from "../services/rechargeService.js";

export async function postRecharge(req: Request, res: Response) {
    const { cardId, amount } = req.body;
    await createRecharge(cardId, amount);
    res.sendStatus(201);
}
