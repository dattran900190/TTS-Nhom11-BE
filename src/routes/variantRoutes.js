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
import { getVariants, createVariant, updateVariant, deleteVariant, addVariantToProduct, softDeleteVariant, restoreVariant } from "../controllers/productVariantController.js";

const router = Router();

router.get("/", validateGetVariants, validateRequest, getVariants);
router.post("/create",authenticateToken,authorizeRoles("admin", "superadmin"),validateCreateVariant,validateRequest,createVariant);
router.put("/edit/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateUpdateVariant,validateRequest,updateVariant);
router.delete("/delete/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateDeleteVariant,validateRequest,deleteVariant);
router.post("/addVariant/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateAddVariantVariant,validateRequest,addVariantToProduct);
router.delete("/soft-delete/:id", authenticateToken,authorizeRoles("admin", "superadmin"),validatesoftDeleteVariant,validateRequest, softDeleteVariant);
router.patch("/restore/:id", authenticateToken,authorizeRoles("admin", "superadmin"),validateRestoreVariant,validateRequest, restoreVariant);

export default router;
