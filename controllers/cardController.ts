import { Request, Response } from "express";
import {
    createCard,
    activateCard,
    balanceAndTransactions,
    lockCard,
    unlockCard,
} from "../services/cardService.js";

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

export async function getBalance(req: Request, res: Response) {
    const { cardId } = req.params;

    const data = await balanceAndTransactions(+cardId);
    res.send(data);
}

export async function putUnlockCard(req: Request, res: Response) {
    const { cardId, password } = req.body;
    await unlockCard(cardId, password);
    res.sendStatus(200);
}

export async function putLockCard(req: Request, res: Response) {
    const { cardId, password } = req.body;
    await lockCard(cardId, password);
    res.sendStatus(200);
}
