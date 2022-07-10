import Joi from "joi";

export const createCardSchema = Joi.object({
    employeeId: Joi.number().integer().required(),
    type: Joi.string()
        .valid("groceries", "restaurant", "transport", "education", "health")
        .required(),
});
