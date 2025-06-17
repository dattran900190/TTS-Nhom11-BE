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
const adminAuth = [authenticateToken, authorizeRoles("admin", "superadmin")];


router.get("/", getCategories);
router.get("/:id", adminAuth, validateGetCategoryById, validateRequest, getCategoryById);
router.post("/", adminAuth, validateCreateCategory, validateRequest, createCategory);
router.put("/:id", adminAuth, validateUpdateCategory, validateRequest, updateCategory);
router.delete("/:id", adminAuth, validateDeleteCategory, validateRequest, softDeleteCategory);
router.patch("/restore/:id", adminAuth, validateRestoreCategory, validateRequest, restoreCategory);
router.delete("/hard/:id", adminAuth, validateHardDeleteCategory, validateRequest, hardDeleteCategory);

export default router;
