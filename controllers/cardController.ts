import { Request, Response } from "express";
import { createCard } from "../services/cardService.js";

export async function postCard(req: Request, res: Response) {
    const { employeeId, type } = req.body;

    const data = await createCard(employeeId, type);
    const cardData = { ...data.cardObj, securityCode: data.cvcNumber };
    res.send(cardData);
}
