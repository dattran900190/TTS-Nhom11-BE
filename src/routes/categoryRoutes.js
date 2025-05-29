import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  softDeleteCategory,
  restoreCategory,
  hardDeleteCategory,
} from "../controllers/categoryController.js";
import {
  validateCreateCategory,
  validateUpdateCategory,
  validateDeleteCategory,
  validateRestoreCategory,
  validateHardDeleteCategory,
  validateGetCategoryById,
} from "../validations/CategoryValidate.js";

const router = Router();

router.get("/categories", getCategories);
router.get(
  "/categories/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateGetCategoryById,
  validateRequest,
  getCategoryById
);
router.post(
  "/categories",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateCreateCategory,
  validateRequest,
  createCategory
);
router.put(
  "/categories/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateUpdateCategory,
  validateRequest,
  updateCategory
);
router.delete(
  "/categories/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateDeleteCategory,
  validateRequest,
  softDeleteCategory
);
router.patch(
  "/categories/restore/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateRestoreCategory,
  validateRequest,
  restoreCategory
);
router.delete(
  "/categories/hard-delete/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateHardDeleteCategory,
  validateRequest,
  hardDeleteCategory
);

export default router;
