import { Router } from "express";
import { postCard } from "../controllers/cardController.js";
import { validateApiKey } from "../middlewares/apiKeyValidator.js";
import schemaValidator from "../middlewares/schemaValidator.js";
import { createCardSchema } from "../schemas/cardSchema.js";

const cardRouter = Router();

cardRouter.post(
    "/card/create",
    schemaValidator(createCardSchema),
    validateApiKey,
    postCard
);

export default cardRouter;
