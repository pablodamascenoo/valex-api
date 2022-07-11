import { Router } from "express";
import cardRouter from "./cardRouter.js";
import paymentsRouter from "./paymentsRouter.js";

const router = Router();

router.use(cardRouter);
router.use(paymentsRouter);

export default router;
