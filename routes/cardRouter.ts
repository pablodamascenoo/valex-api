import { Router } from "express";
import {
    getBalance,
    postCard,
    putLockCard,
    putUnlockCard,
    updateCard,
} from "../controllers/cardController.js";
import { validateApiKey } from "../middlewares/apiKeyValidator.js";
import schemaValidator from "../middlewares/schemaValidator.js";
import {
    activateCardSchema,
    createCardSchema,
    lockUnlockCardSchema,
} from "../schemas/cardSchema.js";

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
cardRouter.put(
    "/cards/lock",
    schemaValidator(lockUnlockCardSchema),
    putLockCard
);
cardRouter.put(
    "/cards/unlock",
    schemaValidator(lockUnlockCardSchema),
    putUnlockCard
);

export default cardRouter;
