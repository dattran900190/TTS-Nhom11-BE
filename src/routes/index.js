import { Router } from "express";
import { getProducts, createProduct, updateProduct, deleteProduct, getProductDetail, addVariantToProduct } from "../controllers/productController.js"; // import thiếu .js
import { getBrand, createBrand, updateBrand, deleteBrand } from "../controllers/brandController.js";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import {
    validateCreateRole,
    validateUpdateRole,
    validateDeleteRole,
    validateGetRole,
} from "../validations/RoleValidate.js";
import validateRequest from "../middlewares/validateRequest.js";
import {
    getRole,
    createRole,
    updateRole,
    deleteRole,
} from "../controllers/roleController.js";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import { getVariants, createVariant, updateVariant, deleteVariant } from "../controllers/productVariantController.js";

import { register, login } from "../controllers/authController.js";
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
routes.get("/categories", getCategories);
routes.get("/categories/:id", getCategoryById);
routes.post("/categories", createCategory);
routes.put("/categories/:id", updateCategory);
routes.delete("/categories/:id", deleteCategory);

// route role
routes.get("/roles", validateGetRole, validateRequest, getRole);
routes.post("/roles/create", validateCreateRole, validateRequest, createRole);
routes.put("/roles/edit/:id", validateUpdateRole, validateRequest, updateRole);
routes.delete("/roles/delete/:id", validateDeleteRole, validateRequest, deleteRole);

// route user
routes.get("/users", getUsers);
routes.post("/users/create", createUser);
routes.put("/users/edit/:user_id", updateUser);
routes.delete("/users/delete/:user_id", deleteUser);

// route variant
routes.get("/variants", getVariants);
routes.post("/variants/create", createVariant);
routes.put("/variants/edit/:variant_id", updateVariant);
routes.delete("/variants/delete/:variant_id", deleteVariant);

// Route đăng ký
routes.post("/register", register);
// Route đăng nhập
routes.post("/login", login);
export default routes;

