import { Router } from "express";
import cardRouter from "./cardRouter.js";
import paymentsRouter from "./paymentsRouter.js";
import rechargeRouter from "./rechargeRouter.js";

const router = Router();

router.use(cardRouter);
router.use(paymentsRouter);
router.use(rechargeRouter);

export default router;
