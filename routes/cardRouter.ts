import { Router } from "express";
import { postCard, updateCard } from "../controllers/cardController.js";
import { validateApiKey } from "../middlewares/apiKeyValidator.js";
import schemaValidator from "../middlewares/schemaValidator.js";
import { activateCardSchema, createCardSchema } from "../schemas/cardSchema.js";

const cardRouter = Router();

cardRouter.post(
    "/card/create",
    schemaValidator(createCardSchema),
    validateApiKey,
    postCard
);
cardRouter.put(
    "/card/activate",
    schemaValidator(activateCardSchema),
    updateCard
);

export default cardRouter;
