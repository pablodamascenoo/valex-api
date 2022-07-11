import Joi from "joi";

const paymentsSchema = Joi.object({
    cardId: Joi.number().integer().required(),
    password: Joi.string()
        .pattern(/[0-9]{4}/)
        .required(),
    businessId: Joi.number().integer().required(),
    amount: Joi.number().integer().min(1).required(),
});

export default paymentsSchema;
