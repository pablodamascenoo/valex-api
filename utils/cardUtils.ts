import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import Cryptr from "cryptr";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { cardHolderFormatter } from "./employeeUtils.js";

dotenv.config();
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

export async function existsCard(cardId: number) {
    const cardFound = await cardRepository.findById(cardId);

    if (!cardFound) throw { status: 404, message: "card not found" };

    return cardFound;
}

export function isExpired(expirationDate: string) {
    if (dayjs(expirationDate).isBefore(dayjs(Date.now()).format("MM/YY"))) {
        throw { status: 401, message: "card expired" };
    }
}

export function verifyCvc(EncriptedCvc: string, securityCode: string) {
    const decryptedCvc = cryptr.decrypt(EncriptedCvc);
    if (decryptedCvc !== securityCode) {
        throw { status: 401, message: "security code do not match" };
    }
}

export function generateCardData(
    employeeId: number,
    type: cardRepository.TransactionTypes,
    employee: employeeRepository.Employee
) {
    const cvcObj = generateAndEncryptCVC();

    const data: cardRepository.CardInsertData = {
        employeeId,
        number: createCardNumber(),
        cardholderName: cardHolderFormatter(employee.fullName),
        securityCode: cvcObj.crypted,
        expirationDate: generateExpirationDate(),
        isBlocked: false,
        isVirtual: false,
        originalCardId: null,
        password: null,
        type: type,
    };

    return { data, cvcNumber: cvcObj.number };
}

export async function cardTypeAlreadyExists(
    employeeId: number,
    type: cardRepository.TransactionTypes
) {
    const cardFound = await cardRepository.findByTypeAndEmployeeId(
        type,
        employeeId
    );

    if (cardFound)
        throw {
            status: 409,
            message: `${type} card already exists to this employee`,
        };
}

export function verifyPassword(password: string, cryptedPassword: string) {
    if (!bcrypt.compareSync(password, cryptedPassword))
        throw { status: 401, message: "wrong password!" };
}

function createCardNumber() {
    return faker.finance.creditCardNumber("visa");
}

function generateAndEncryptCVC() {
    let number = faker.finance.creditCardCVV();

    const cvcObj = {
        number,
        crypted: cryptr.encrypt(number),
    };

    return cvcObj;
}

function generateExpirationDate() {
    return dayjs().add(5, "year").format("MM/YY");
}
