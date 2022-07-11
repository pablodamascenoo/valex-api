import { existsCard, isExpired } from "../utils/cardUtils.js";
import { insert } from "../repositories/rechargeRepository.js";

export async function createRecharge(cardId: number, amount: number) {
    const foundCard = await existsCard(cardId);
    if (!foundCard.password)
        throw { status: 401, message: "card must be active" };
    isExpired(foundCard.expirationDate);
    await insert({ cardId, amount });
}
