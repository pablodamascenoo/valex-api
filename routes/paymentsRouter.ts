import { Router } from "express";
import { postPayment } from "../controllers/paymentsController.js";
import schemaValidator from "../middlewares/schemaValidator.js";
import paymentsSchema from "../schemas/paymentsSchema.js";

const paymentsRouter = Router();

paymentsRouter.post(
    "/cards/payment",
    schemaValidator(paymentsSchema),
    postPayment
);

export default paymentsRouter;
