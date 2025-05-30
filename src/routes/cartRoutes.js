import express from "express";
import {addItemToCart,getCartByUser,updateCartItem,deleteCartItem,} from "../controllers/cartController.js";
import {validateAddItemToCart,validateGetCartByUser,validateUpdateCartItem,validateDeleteCartItem} from "../validations/cartValidation.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/add-item",authenticateToken, validateAddItemToCart, validateRequest, addItemToCart);
router.get("/user/:userId", authenticateToken,validateGetCartByUser, validateRequest, getCartByUser);
router.put("/item/:id",authenticateToken, validateUpdateCartItem, validateRequest, updateCartItem);
router.delete("/item/:id",authenticateToken, validateDeleteCartItem, validateRequest, deleteCartItem);

export default router;
