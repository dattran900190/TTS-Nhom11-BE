import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  validateGetProduct,
  validateCreateProduct,
  validateUpdateProduct,
  validateDeleteProduct,
  validatesoftDeleteProduct,
  validateRestoreProduct,
  validateDetailProduct,
  // validateAddVariantProduct, 
} from "../validations/ProductValidate.js";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  softDeleteProduct,
  restoreProduct,
} from "../controllers/productController.js";

const router = Router();
const adminAuth = [authenticateToken, authorizeRoles("admin", "superadmin")];


router.get("/", validateGetProduct, validateRequest, getProducts);
router.get("/:id", adminAuth, validateDetailProduct, validateRequest, getProductDetail);
router.post("/", adminAuth, validateCreateProduct, validateRequest, createProduct);
router.put("/:id", adminAuth, validateUpdateProduct, validateRequest, updateProduct);
router.delete("/:id", adminAuth, validateDeleteProduct, validateRequest, deleteProduct);
router.delete("/soft/:id", adminAuth, validatesoftDeleteProduct, validateRequest, softDeleteProduct);
router.patch("/restore/:id", adminAuth, validateRestoreProduct, validateRequest, restoreProduct);

export default router;
