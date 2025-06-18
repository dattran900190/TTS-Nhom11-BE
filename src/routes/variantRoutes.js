import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  validateGetVariants,
  validateCreateVariant,
  validateUpdateVariant,
  validateDeleteVariant,
  validateAddVariantVariant,
  validatesoftDeleteVariant,
  validateRestoreVariant
} from "../validations/VariantValidate.js";
import {
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  addVariantToProduct,
  softDeleteVariant,
  restoreVariant
} from "../controllers/productVariantController.js";

const router = Router();
const adminAuth = [authenticateToken, authorizeRoles("admin", "superadmin")];

router.get("/", validateGetVariants, validateRequest, getVariants);
router.post("/", adminAuth, validateCreateVariant, validateRequest, createVariant);
router.put("/:id", adminAuth, validateUpdateVariant, validateRequest, updateVariant);
router.delete("/:id", adminAuth, validateDeleteVariant, validateRequest, deleteVariant);
router.post("/add-to-product/:id", adminAuth, validateAddVariantVariant, validateRequest, addVariantToProduct);
router.delete("/soft-delete/:id", adminAuth, validatesoftDeleteVariant, validateRequest, softDeleteVariant);
router.patch("/restore/:id", adminAuth, validateRestoreVariant, validateRequest, restoreVariant);

export default router;
