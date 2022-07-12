import { Router } from "express";
import {
    getBalance,
    postCard,
    updateCard,
} from "../controllers/cardController.js";
import { validateApiKey } from "../middlewares/apiKeyValidator.js";
import schemaValidator from "../middlewares/schemaValidator.js";
import { activateCardSchema, createCardSchema } from "../schemas/cardSchema.js";

const cardRouter = Router();

cardRouter.post(
    "/cards/create",
    schemaValidator(createCardSchema),
    validateApiKey,
    postCard
);
cardRouter.put(
    "/cards/activate",
    schemaValidator(activateCardSchema),
    updateCard
);
cardRouter.get("/cards/:cardId/balance", getBalance);

export default cardRouter;
