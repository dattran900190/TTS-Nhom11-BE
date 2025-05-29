import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  validateGetBrand,
  validateCreateBrand,
  validateUpdateBrand,
  validateDeleteBrand,
  validateRestoreBrand,
  validatesoftDeleteBrand,
} from "../validations/BrandValidate.js";
import {
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  softDeleteBrand,
  restoreBrand,
} from "../controllers/brandController.js";

const router = Router();

router.get("/brands", validateGetBrand, validateRequest, getBrand);
router.post(
  "/brands/create",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateCreateBrand,
  validateRequest,
  createBrand
);
router.put(
  "/brands/edit/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateUpdateBrand,
  validateRequest,
  updateBrand
);
router.delete(
  "/brands/delete/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateDeleteBrand,
  validateRequest,
  deleteBrand
);
router.delete(
  "/brands/soft-delete/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validatesoftDeleteBrand,
  validateRequest,
  softDeleteBrand
);
router.patch(
  "/brands/restore/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateRestoreBrand,
  validateRequest,
  restoreBrand
);

export default router;
