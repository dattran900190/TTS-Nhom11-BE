import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { validateGetDiscount, validateCreateDiscount, validateDeleteDiscount, validateUpdateDiscount, validatesoftDeleteDiscount, validateRestoreDiscount} from "../validations/DiscountValidate.js";
import { getDiscounts, createDiscount, updateDiscount, deleteDiscount, softDeleteDiscount, restoreDiscount } from "../controllers/discountController.js";

const router = Router();

router.get("/", validateGetDiscount, validateRequest, getDiscounts);
router.post( "/create", authenticateToken, authorizeRoles("admin", "superadmin"), validateCreateDiscount, validateRequest, createDiscount );
router.put( "/edit/:id", authenticateToken, authorizeRoles("admin", "superadmin"), validateUpdateDiscount, validateRequest, updateDiscount );
router.delete( "/delete/:id", authenticateToken, authorizeRoles("admin", "superadmin"), validateDeleteDiscount, validateRequest, deleteDiscount );
router.delete( "/soft-delete/:id", authenticateToken, authorizeRoles("admin", "superadmin"), validatesoftDeleteDiscount, validateRequest, softDeleteDiscount );
router.patch( "/restore/:id", authenticateToken, authorizeRoles("admin", "superadmin"), validateRestoreDiscount, validateRequest, restoreDiscount );

export default router;
