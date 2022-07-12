import * as cardRepository from "../repositories/cardRepository.js";
import bcrypt from "bcrypt";
import {
    cardTypeAlreadyExists,
    existsCard,
    generateCardData,
    isExpired,
    verifyCvc,
    showBalance,
    verifyPassword,
} from "../utils/cardUtils.js";
import { existsEmployee } from "../utils/employeeUtils.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

export async function createCard(
    employeeId: number,
    type: cardRepository.TransactionTypes
) {
    const employee = await existsEmployee(employeeId);
    await cardTypeAlreadyExists(employeeId, type);
    const cardData = generateCardData(employeeId, type, employee);
    const cardObj = await cardRepository.insert(cardData.data);
    return { cardObj, cvcNumber: cardData.cvcNumber };
}

export async function activateCard(
    cardId: number,
    securityCode: string,
    password: string
) {
    const cardFound = await existsCard(cardId);
    isExpired(cardFound.expirationDate);
    verifyCvc(cardFound.securityCode, securityCode);
    if (cardFound.password)
        throw { status: 409, message: "card already active" };
    const SALT = bcrypt.genSaltSync(15);
    const cryptedPassword = bcrypt.hashSync(password, SALT);
    const data: cardRepository.CardUpdateData = {
        password: cryptedPassword,
    };
    await cardRepository.update(cardId, data);
}

export async function balanceAndTransactions(cardId: number) {
    if (isNaN(cardId)) throw { status: 422, message: "id must be a number" };
    await existsCard(cardId);
    const balance = await showBalance(cardId);
    const data = {
        balance,
        transactions: await paymentRepository.findByCardId(cardId),
        recharges: await rechargeRepository.findByCardId(cardId),
    };
    return data;
}

export async function lockCard(cardId: number, password: string) {
    const cardFound = await existsCard(cardId);
    isExpired(cardFound.expirationDate);
    if (cardFound.isBlocked)
        throw { status: 409, message: "card is already blocked" };
    verifyPassword(password, cardFound.password);
    cardRepository.update(cardId, { isBlocked: true });
}

export async function unlockCard(cardId: number, password: string) {
    const cardFound = await existsCard(cardId);
    isExpired(cardFound.expirationDate);
    if (!cardFound.isBlocked)
        throw { status: 409, message: "card isn't blocked" };
    verifyPassword(password, cardFound.password);
    cardRepository.update(cardId, { isBlocked: false });
}
