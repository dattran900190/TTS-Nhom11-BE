import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {validateGetPayment,validateUpdatePayment,} from "../validations/PaymentValidate.js";
import {getPayment,updatePaymentStatus,} from "../controllers/paymentController.js";

const router = Router();
const adminAuth = [authenticateToken, authorizeRoles("admin", "superadmin")];

router.get("/", validateGetPayment, validateRequest, getPayment);
router.put("/:id", adminAuth, validateUpdatePayment, validateRequest, updatePaymentStatus);

export default router;
