import {
    isExpired,
    existsCard,
    verifyPassword,
    showBalance,
} from "../utils/cardUtils.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import { TransactionTypes } from "../repositories/cardRepository.js";

export async function createPayment(
    cardId: number,
    password: string,
    businessId: number,
    amount: number
) {
    const foundCard = await existsCard(cardId);
    isExpired(foundCard.expirationDate);
    if (!foundCard.password.length || foundCard.isBlocked) {
        throw {
            status: 401,
            message: "the card must be active and not blocked",
        };
    }
    verifyPassword(password, foundCard.password);
    await verifyBusiness(businessId, foundCard.type);
    await verifyAmount(cardId, amount);
    await paymentRepository.insert({ cardId, businessId, amount });
}

async function verifyBusiness(businessId: number, type: TransactionTypes) {
    const business = await businessRepository.findById(businessId);
    if (!business) throw { status: 404, message: "business not found" };
    if (business.type !== type)
        throw {
            status: 409,
            message: "the business isn't of the same type as the card",
        };
}

async function verifyAmount(cardId: number, amount: number) {
    const balance = await showBalance(cardId);

    if (+amount > balance)
        throw { status: 401, message: "not enough balance in the card" };
}
