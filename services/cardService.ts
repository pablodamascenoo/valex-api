import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import Cryptr from "cryptr";
import dayjs from "dayjs";

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

//#TODO: finish generateCardData
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

    console.log(cardFound);

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
    return dayjs().add(5, "year").format("MM/YYYY");
}
