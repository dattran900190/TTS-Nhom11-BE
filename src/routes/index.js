import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js"; // express-validator

// import product
import { validateGetProduct, validateCreateProduct, validateDeleteProduct, validateUpdateProduct } from "../validations/ProductValidate.js";
import { getProducts, createProduct, updateProduct, deleteProduct, getProductDetail } from "../controllers/productController.js"; // import thiếu .js

// import brand
import { validateGetBrand, validateCreateBrand, validateUpdateBrand, validateDeleteBrand, validateRestoreBrand, validatesoftDeleteBrand } from "../validations/BrandValidate.js";
import { getBrand, createBrand, updateBrand, deleteBrand, softDeleteBrand, restoreBrand } from "../controllers/brandController.js";

import { createCategory,getCategories,getCategoryById,updateCategory,softDeleteCategory,restoreCategory,hardDeleteCategory, } from "../controllers/categoryController.js";
import {validateCreateCategory,validateUpdateCategory,validateDeleteCategory,validateRestoreCategory,validateHardDeleteCategory,validateGetCategoryById,} from "../validations/CategoryValidate.js";

//import user
import { validateCreateUser, validateUpdateUser, validateDeleteUser, validateGetUser } from "../validations/UserValidate.js";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js";

//import order
import { validateCreateOrder, validateUpdateOrder, validateDeleteOrder, validateGetOrders} from "../validations/OrderValidate.js";
import { getOrders, createOrder, updateOrder, deleteOrder } from "../controllers/orderController.js";

//import order detail
import { validateCreateOrderDetail, validateUpdateOrderDetail, validateDeleteOrderDetail, validateGetOrderDetails } from "../validations/OrderDetailValidate.js";
import { getOrderDetails, createOrderDetail, updateOrderDetail, deleteOrderDetail } from "../controllers/orderDetailController.js";

import { getVariants, createVariant, updateVariant, deleteVariant, addVariantToProduct } from "../controllers/productVariantController.js";
// import { register, login } from "../controllers/authController.js";

import { register, login,sendOtp, resetPassword, confirmEmail, refreshToken  } from "../controllers/authController.js";
import { registerValidator, loginValidator } from "../validations/AuthValidate.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
const routes = Router();

// routes.use("/products", hanldeProduct...)

// route product
routes.get("/products", validateGetProduct, validateRequest, getProducts);
routes.post("/products/create",authenticateToken, authorizeRoles('admin'), validateCreateProduct, validateRequest, createProduct);
routes.put("/products/edit/:id",authenticateToken, authorizeRoles('admin'), validateUpdateProduct, validateRequest, updateProduct);
routes.delete("/products/delete/:id",authenticateToken, authorizeRoles('admin'), validateDeleteProduct, validateRequest, deleteProduct);
routes.get("/products/show/:id",authenticateToken, authorizeRoles('admin'), getProductDetail);
routes.post("/products/addVariant/:id",authenticateToken, authorizeRoles('admin'), addVariantToProduct);

// route brand
routes.get("/brands", validateGetBrand, validateRequest, getBrand); // Lấy danh sách brand chưa bị xoá 
                                                                    // | `/brands?only_deleted=true`    | Chỉ lấy brand đã bị xoá mềm
                                                                    // | `/brands?include_deleted=true` | Lấy tất cả brand bao gồm xoá mềm
routes.post("/brands/create",authenticateToken, authorizeRoles('admin'), validateCreateBrand, validateRequest, createBrand);
routes.put("/brands/edit/:id",authenticateToken, authorizeRoles('admin'), validateUpdateBrand, validateRequest, updateBrand);
routes.delete("/brands/delete/:id",authenticateToken, authorizeRoles('admin'), validateDeleteBrand, validateRequest, deleteBrand);
routes.delete("/brands/soft-delete/:id",authenticateToken, authorizeRoles('admin'), validatesoftDeleteBrand, validateRequest, softDeleteBrand);
routes.patch("/brands/restore/:id", authenticateToken, authorizeRoles('admin'), validateRestoreBrand, validateRequest, restoreBrand); // Khôi phục brand đã bị xoá

// route category
routes.get("/categories",getCategories);
routes.get("/categories/:id",authenticateToken, authorizeRoles('admin'), validateGetCategoryById,validateRequest,getCategoryById);
routes.post("/categories",authenticateToken, authorizeRoles('admin'),validateCreateCategory,validateRequest,createCategory);
routes.put("/categories/:id",authenticateToken, authorizeRoles('admin'),validateUpdateCategory,validateRequest,updateCategory);
routes.delete("/categories/:id",authenticateToken, authorizeRoles('admin'),validateDeleteCategory,validateRequest,softDeleteCategory);
routes.patch("/categories/restore/:id",authenticateToken, authorizeRoles('admin'),validateRestoreCategory,validateRequest,restoreCategory);
routes.delete("/categories/hard-delete/:id",authenticateToken, authorizeRoles('admin'),validateHardDeleteCategory,validateRequest,hardDeleteCategory);

// route user
routes.get("/users",authenticateToken, authorizeRoles('admin'), validateGetUser, validateRequest, getUsers);
routes.post("/users/create",authenticateToken, authorizeRoles('admin'), validateCreateUser, validateRequest, createUser);
routes.put("/users/edit/:id",authenticateToken, authorizeRoles('admin'), validateUpdateUser, validateRequest, updateUser);
routes.delete("/users/delete/:id",authenticateToken, authorizeRoles('admin'), validateDeleteUser, validateRequest, deleteUser);

// Orders
routes.get("/orders",authenticateToken, authorizeRoles('admin'), validateGetOrders, validateRequest, getOrders);
routes.post("/orders/create",authenticateToken, authorizeRoles('admin'), validateCreateOrder, validateRequest, createOrder);
routes.put("/orders/edit/:id",authenticateToken, authorizeRoles('admin'), validateUpdateOrder, validateRequest, updateOrder);
routes.delete("/orders/delete/:id",authenticateToken, authorizeRoles('admin'), validateDeleteOrder, validateRequest, deleteOrder);

// OrderDetails
routes.get("/order-details",authenticateToken, authorizeRoles('admin'), validateGetOrderDetails, validateRequest, getOrderDetails);
routes.post("/orders/:id/details",authenticateToken, authorizeRoles('admin'), validateCreateOrderDetail, validateRequest, createOrderDetail);
routes.put("/order-details/:order_detail_id",authenticateToken, authorizeRoles('admin'), validateUpdateOrderDetail, validateRequest, updateOrderDetail);
routes.delete("/order-details/:order_detail_id",authenticateToken, authorizeRoles('admin'), validateDeleteOrderDetail, validateRequest, deleteOrderDetail);

// route variant
routes.get("/variants", getVariants);
routes.post("/variants/create",authenticateToken, authorizeRoles('admin'), createVariant);
routes.put("/variants/edit/:variant_id",authenticateToken, authorizeRoles('admin'), updateVariant);
routes.delete("/variants/delete/:variant_id",authenticateToken, authorizeRoles('admin'), deleteVariant);

// AUTH ROUTES (Đăng ký, đăng nhập, đổi mật khẩu không cần auth)
routes.post("/register", registerValidator, validBodyRequest, register);
routes.post("/login", loginValidator, validBodyRequest, login);
routes.post("/send-otp", sendOtp);
routes.get("/confirm-email", confirmEmail);
routes.post("/reset-password", resetPassword);
routes.post('/refresh-token', refreshToken);
export default routes;

