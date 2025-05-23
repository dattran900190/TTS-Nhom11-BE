import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js"; // express-validator

// import product
import { validateGetProduct, validateCreateProduct, validateDeleteProduct, validateUpdateProduct } from "../validations/ProductValidate.js";
import { getProducts, createProduct, updateProduct, deleteProduct, getProductDetail, addVariantToProduct } from "../controllers/productController.js"; // import thiếu .js

// import brand
import { validateGetBrand, validateCreateBrand, validateUpdateBrand, validateDeleteBrand } from "../validations/BrandValidate.js";
import { getBrand, createBrand, updateBrand, deleteBrand } from "../controllers/brandController.js";

import { createCategory,getCategories,getCategoryById,updateCategory,softDeleteCategory,restoreCategory,hardDeleteCategory, } from "../controllers/categoryController.js";
import {validateCreateCategory,validateUpdateCategory,validateDeleteCategory,validateRestoreCategory,validateHardDeleteCategory,validateGetCategoryById,} from "../validations/CategoryValidate.js";

// import role
import { validateCreateRole, validateUpdateRole, validateDeleteRole, validateGetRole } from "../validations/RoleValidate.js";
import { getRole, createRole, updateRole, deleteRole } from "../controllers/roleController.js";

//import user
import { validateCreateUser, validateUpdateUser, validateDeleteUser, validateGetUser } from "../validations/UserValidate.js";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js";

//import order
import { validateCreateOrder, validateUpdateOrder, validateDeleteOrder, validateGetOrders} from "../validations/OrderValidate.js";
import { getOrders, createOrder, updateOrder, deleteOrder } from "../controllers/orderController.js";

//import order detail
import { validateCreateOrderDetail, validateUpdateOrderDetail, validateDeleteOrderDetail, validateGetOrderDetails } from "../validations/OrderDetailValidate.js";
import { getOrderDetails, createOrderDetail, updateOrderDetail, deleteOrderDetail } from "../controllers/orderDetailController.js";

import { getVariants, createVariant, updateVariant, deleteVariant } from "../controllers/productVariantController.js";
// import { register, login } from "../controllers/authController.js";

import { register, login,sendOtp, resetPassword } from "../controllers/authController.js";
import { registerValidator, loginValidator } from "../validations/AuthValidate.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
const routes = Router();

// routes.use("/products", hanldeProduct...)

// route product
routes.get("/products", validateGetProduct, validateRequest, getProducts);
routes.post("/products/create", validateCreateProduct, validateRequest, createProduct);
routes.put("/products/edit/:id", validateUpdateProduct, validateRequest, updateProduct);
routes.delete("/products/delete/:id", validateDeleteProduct, validateRequest, deleteProduct);
routes.get("/products/show/:id", getProductDetail);
routes.post("/products/addVariant/:id", addVariantToProduct);

// route brand
routes.get("/brands", validateGetBrand, validateRequest, getBrand);
routes.post("/brands/create", validateCreateBrand, validateRequest, createBrand);
routes.put("/brands/edit/:brand_id", validateUpdateBrand, validateRequest, updateBrand);
routes.delete("/brands/delete/:brand_id", validateDeleteBrand, validateRequest, deleteBrand);

// route category
routes.get("/categories",getCategories);
routes.get("/categories/:id",validateGetCategoryById,validateRequest,getCategoryById);
routes.post("/categories",validateCreateCategory,validateRequest,createCategory);
routes.put("/categories/:id",validateUpdateCategory,validateRequest,updateCategory);
routes.delete("/categories/:id",validateDeleteCategory,validateRequest,softDeleteCategory);
routes.patch("/categories/restore/:id",validateRestoreCategory,validateRequest,restoreCategory);
routes.delete("/categories/hard-delete/:id",validateHardDeleteCategory,validateRequest,hardDeleteCategory);

// route role
routes.get("/roles", validateGetRole, validateRequest, getRole);
routes.post("/roles/create", validateCreateRole, validateRequest, createRole);
routes.put("/roles/edit/:id", validateUpdateRole, validateRequest, updateRole);
routes.delete("/roles/delete/:id", validateDeleteRole, validateRequest, deleteRole);

// route user
routes.get("/users", validateGetUser, validateRequest, getUsers);
routes.post("/users/create", validateCreateUser, validateRequest, createUser);
routes.put("/users/edit/:id", validateUpdateUser, validateRequest, updateUser);
routes.delete("/users/delete/:id", validateDeleteUser, validateRequest, deleteUser);

// Orders
routes.get("/orders", validateGetOrders, validateRequest, getOrders);
routes.post("/orders/create", validateCreateOrder, validateRequest, createOrder);
routes.put("/orders/edit/:id", validateUpdateOrder, validateRequest, updateOrder);
routes.delete("/orders/delete/:id", validateDeleteOrder, validateRequest, deleteOrder);

// OrderDetails
routes.get("/order-details", validateGetOrderDetails, validateRequest, getOrderDetails);
routes.post("/orders/:id/details", validateCreateOrderDetail, validateRequest, createOrderDetail);
routes.put("/order-details/:order_detail_id", validateUpdateOrderDetail, validateRequest, updateOrderDetail);
routes.delete("/order-details/:order_detail_id", validateDeleteOrderDetail, validateRequest, deleteOrderDetail);

// route variant
routes.get("/variants", getVariants);
routes.post("/variants/create", createVariant);
routes.put("/variants/edit/:variant_id", updateVariant);
routes.delete("/variants/delete/:variant_id", deleteVariant);

// Route đăng ký
routes.post("/register", registerValidator, validBodyRequest, register);
// Route đăng nhập
routes.post("/login",loginValidator, validBodyRequest, login);
// Route đổi mật khẩu
routes.post("/send-otp", sendOtp);
routes.post("/reset-password", resetPassword);
export default routes;

