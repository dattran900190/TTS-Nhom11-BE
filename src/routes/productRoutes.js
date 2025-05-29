import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import {authenticateToken,authorizeRoles,} from "../middlewares/authMiddleware.js";
import {validateGetProduct,validateCreateProduct,validateDeleteProduct,validateUpdateProduct,validatesoftDeleteProduct,validateRestoreProduct,validateDetailProduct,validateAddVariantProduct,} from "../validations/ProductValidate.js";
import {getProducts,createProduct,updateProduct,deleteProduct,getProductDetail,softDeleteProduct,restoreProduct,} from "../controllers/productController.js";

const router = Router();

router.get("/products", validateGetProduct, validateRequest, getProducts);
router.post("/products/create",authenticateToken,authorizeRoles("admin", "superadmin"),validateCreateProduct,validateRequest,createProduct);
router.put("/products/edit/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateUpdateProduct,validateRequest,updateProduct);
router.delete("/products/delete/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateDeleteProduct,validateRequest,deleteProduct);
router.get("/products/show/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateDetailProduct,validateRequest,getProductDetail);
router.delete("/products/soft-delete/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validatesoftDeleteProduct,validateRequest,softDeleteProduct);
router.patch("/products/restore/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateRestoreProduct,validateRequest,restoreProduct);

export default router;
