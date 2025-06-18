import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {validateGetDiscount,validateCreateDiscount,validateUpdateDiscount,validateDeleteDiscount,validatesoftDeleteDiscount,validateRestoreDiscount} from "../validations/DiscountValidate.js";
import {getDiscounts,createDiscount,updateDiscount,deleteDiscount,softDeleteDiscount,restoreDiscount} from "../controllers/discountController.js";

const router = Router();
const adminAuth = [authenticateToken, authorizeRoles("admin", "superadmin")];

router.get("/", validateGetDiscount, validateRequest, getDiscounts);
router.post("/", adminAuth, validateCreateDiscount, validateRequest, createDiscount);
router.put("/:id", adminAuth, validateUpdateDiscount, validateRequest, updateDiscount);
router.delete("/:id", adminAuth, validateDeleteDiscount, validateRequest, deleteDiscount);
router.delete("/soft-delete/:id", adminAuth, validatesoftDeleteDiscount, validateRequest, softDeleteDiscount);
router.patch("/restore/:id", adminAuth, validateRestoreDiscount, validateRequest, restoreDiscount);

export default router;
