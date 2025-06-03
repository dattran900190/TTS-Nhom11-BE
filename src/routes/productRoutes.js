import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import {authenticateToken,authorizeRoles,} from "../middlewares/authMiddleware.js";
import {validateGetProduct,validateCreateProduct,validateDeleteProduct,validateUpdateProduct,validatesoftDeleteProduct,validateRestoreProduct,validateDetailProduct,validateAddVariantProduct,} from "../validations/ProductValidate.js";
import {getProducts,createProduct,updateProduct,deleteProduct,getProductDetail,softDeleteProduct,restoreProduct,} from "../controllers/productController.js";

const router = Router();

router.get("/", validateGetProduct, validateRequest, getProducts);
router.post("/create",authenticateToken,authorizeRoles("admin", "superadmin"),validateCreateProduct,validateRequest,createProduct);
router.put("/edit/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateUpdateProduct,validateRequest,updateProduct);
router.delete("/delete/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateDeleteProduct,validateRequest,deleteProduct);
router.get("/show/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateDetailProduct,validateRequest,getProductDetail);
router.delete("/soft-delete/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validatesoftDeleteProduct,validateRequest,softDeleteProduct);
router.patch("/restore/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateRestoreProduct,validateRequest,restoreProduct);

export default router;
