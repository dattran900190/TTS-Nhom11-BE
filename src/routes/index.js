import { Router } from "express";
import { getProducts } from "../controllers/productController.js"; // import thiếu .js
import { getBrand ,createBrand, updateBrand, deleteBrand } from "../controllers/brandController.js";
import {  createCategory,getCategories,getCategoryById,updateCategory,deleteCategory } from "../controllers/categoryController.js";
import { getRole, createRole, updateRole, deleteRole } from "../controllers/roleController.js";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js";

const routes = Router();

// routes.use("/products", hanldeProduct...)

routes.get("/products", getProducts);


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
routes.get("/roles", getRole);
routes.post("/roles/create", createRole);
routes.put("/roles/edit/:role_id", updateRole);
routes.delete("/roles/delete/:role_id", deleteRole);

// route user
routes.get("/users", getUsers);
routes.post("/users/create", createUser);
routes.put("/users/edit/:id", updateUser);
routes.delete("/users/delete/:id", deleteUser);


export default routes;

