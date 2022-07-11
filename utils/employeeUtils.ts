import * as employeeRepository from "../repositories/employeeRepository.js";

export async function existsEmployee(employeeId: number) {
    const employeeFound = await employeeRepository.findById(employeeId);
    if (!employeeFound) throw { status: 404, message: "employee not found" };
    return employeeFound;
}

export function cardHolderFormatter(employeeName: string) {
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
