import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  validateGetVariants,
  validateCreateVariant,
  validateUpdateVariant,
  validateDeleteVariant,
} from "../validations/VariantValidate.js";
import { getVariants, createVariant, updateVariant, deleteVariant } from "../controllers/productVariantController.js";

const router = Router();

router.get("/variants", validateGetVariants, validateRequest, getVariants);
router.post(
  "/variants/create",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateCreateVariant,
  validateRequest,
  createVariant
);
router.put(
  "/variants/edit/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateUpdateVariant,
  validateRequest,
  updateVariant
);
router.delete(
  "/variants/delete/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateDeleteVariant,
  validateRequest,
  deleteVariant
);

export default router;
