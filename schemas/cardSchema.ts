import Joi from "joi";

export const createCardSchema = Joi.object({
    employeeId: Joi.number().integer().required(),
    type: Joi.string()
        .valid("groceries", "restaurant", "transport", "education", "health")
        .required(),
});

export const activateCardSchema = Joi.object({
    cardId: Joi.number().integer().required(),
    securityCode: Joi.string()
        .pattern(/[0-9]{3}/)
        .required(),
    password: Joi.string()
        .pattern(/[0-9]{4}/)
        .required(),
});

export const lockUnlockCardSchema = Joi.object({
    cardId: Joi.number().integer().required(),
    password: Joi.string()
        .pattern(/[0-9]{4}/)
        .required(),
});
