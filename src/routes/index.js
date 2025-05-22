import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js"; // express-validator
import { getProducts, createProduct, updateProduct, deleteProduct, getProductDetail, addVariantToProduct } from "../controllers/productController.js"; // import thiếu .js
import { getBrand, createBrand, updateBrand, deleteBrand } from "../controllers/brandController.js";
import { createCategory,getCategories,getCategoryById,updateCategory,softDeleteCategory,restoreCategory,hardDeleteCategory, } from "../controllers/categoryController.js";
import {validateCreateCategory,validateUpdateCategory,validateDeleteCategory,validateRestoreCategory,validateHardDeleteCategory,validateGetCategoryById,} from "../validations/CategoryValidate.js";
// import role
import { validateCreateRole, validateUpdateRole, validateDeleteRole, validateGetRole } from "../validations/RoleValidate.js";
import { getRole, createRole, updateRole, deleteRole } from "../controllers/roleController.js";

//import user
import { validateCreateUser, validateUpdateUser, validateDeleteUser, validateGetUser } from "../validations/UserValidate.js";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js";

import { getVariants, createVariant, updateVariant, deleteVariant } from "../controllers/productVariantController.js";

import { register, login } from "../controllers/authController.js";
import { registerValidator, loginValidator } from "../validations/AuthValidate.js";
import { validBodyRequest } from "../middlewares/validBodyRequest.js";
const routes = Router();

// routes.use("/products", hanldeProduct...)

// route product
routes.get("/products", getProducts);
routes.post("/products/create", createProduct);
routes.put("/products/edit/:id", updateProduct);
routes.delete("/products/delete/:id", deleteProduct);
routes.get("/products/show/:id", getProductDetail);
routes.post("/products/addVariant/:id", addVariantToProduct);

// route brand
routes.get("/brands", getBrand);
routes.post("/brands/create", createBrand);
routes.put("/brands/edit/:brand_id", updateBrand);
routes.delete("/brands/delete/:brand_id", deleteBrand);

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

// route variant
routes.get("/variants", getVariants);
routes.post("/variants/create", createVariant);
routes.put("/variants/edit/:variant_id", updateVariant);
routes.delete("/variants/delete/:variant_id", deleteVariant);

// Route đăng ký
routes.post("/register", registerValidator, validBodyRequest, register);
// Route đăng nhập
routes.post("/login",loginValidator, validBodyRequest, login);
export default routes;

