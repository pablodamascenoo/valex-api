import * as cardRepository from "../repositories/cardRepository.js";
import bcrypt from "bcrypt";
import {
    cardTypeAlreadyExists,
    existsCard,
    generateCardData,
    isExpired,
    verifyCvc,
} from "../utils/cardUtils.js";
import { existsEmployee } from "../utils/employeeUtils.js";

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
    if (cardFound.password.length)
        throw { status: 409, message: "card already active" };
    const SALT = bcrypt.genSaltSync(15);
    const cryptedPassword = bcrypt.hashSync(password, SALT);
    const data: cardRepository.CardUpdateData = {
        password: cryptedPassword,
    };
    await cardRepository.update(cardId, data);
}
