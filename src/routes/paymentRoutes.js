import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import {authenticateToken,authorizeRoles,} from "../middlewares/authMiddleware.js";
import {validateGetPayment,validateUpdatePayment,} from "../validations/PaymentValidate.js";
import {getPayment, updatePaymentStatus} from "../controllers/paymentController.js";

const router = Router();

router.get("/", validateGetPayment, validateRequest, getPayment);
router.put("/edit/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateUpdatePayment,validateRequest,updatePaymentStatus);
// router.get("/show/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateDetailProduct,validateRequest,getProductDetail);

export default router;
