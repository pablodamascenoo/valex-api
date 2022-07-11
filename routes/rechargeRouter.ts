import { Router } from "express";
import { postRecharge } from "../controllers/rechargeController.js";
import schemaValidator from "../middlewares/schemaValidator.js";
import rechargeSchema from "../schemas/rechargeSchema.js";

const rechargeRouter = Router();

rechargeRouter.post(
    "/cards/recharge",
    schemaValidator(rechargeSchema),
    postRecharge
);

export default rechargeRouter;
