import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import Cryptr from "cryptr";
import dayjs from "dayjs";
import bcrypt from "bcrypt";

dotenv.config();
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

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
    if (!cardFound.isBlocked)
        throw { status: 409, message: "card already active" };
    const SALT = bcrypt.genSaltSync(15);
    const cryptedPassword = bcrypt.hashSync(password, SALT);
    const data: cardRepository.CardUpdateData = {
        isBlocked: false,
        password: cryptedPassword,
    };
    await cardRepository.update(cardId, data);
}

async function existsCard(cardId: number) {
    const cardFound = await cardRepository.findById(cardId);

    if (!cardFound) throw { status: 404, message: "card not found" };

    return cardFound;
}

function isExpired(expirationDate: string) {
    if (dayjs(expirationDate).isBefore(dayjs(Date.now()).format("MM/YY"))) {
        throw { status: 401, message: "card expired" };
    }
}

function verifyCvc(EncriptedCvc: string, securityCode: string) {
    const decryptedCvc = cryptr.decrypt(EncriptedCvc);
    if (decryptedCvc !== securityCode) {
        throw { status: 401, message: "security code do not match" };
    }
}

function generateCardData(
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
        isBlocked: true,
        isVirtual: false,
        originalCardId: null,
        password: null,
        type: type,
    };

    return { data, cvcNumber: cvcObj.number };
}

async function existsEmployee(employeeId: number) {
    const employeeFound = await employeeRepository.findById(employeeId);
    if (!employeeFound) throw { status: 404, message: "employee not found" };
    return employeeFound;
}

async function cardTypeAlreadyExists(
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

function createCardNumber() {
    return faker.finance.creditCardNumber("visa");
}

function cardHolderFormatter(employeeName: string) {
    let formatedName = [];

    let nameSplited = employeeName.toUpperCase().split(" ");

    for (let index in nameSplited) {
        if (+index !== 0 && +index !== nameSplited.length - 1) {
            if (nameSplited[index].length >= 3)
                formatedName.push(nameSplited[index][0]);
        } else {
            formatedName.push(nameSplited[index]);
        }
    }

    return formatedName.join(" ");
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
