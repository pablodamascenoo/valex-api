import { Request, Response } from "express";
import { createCard, activateCard } from "../services/cardService.js";

export async function postCard(req: Request, res: Response) {
    const { employeeId, type } = req.body;

    const data = await createCard(employeeId, type);
    const cardData = { ...data.cardObj, securityCode: data.cvcNumber };
    res.send(cardData);
}

export async function updateCard(req: Request, res: Response) {
    const { cardId, securityCode, password } = req.body;

    await activateCard(cardId, securityCode, password);
    res.sendStatus(200);
}
