import express from "express";
import {
  addItemToCart,
  getCartByUser,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cartController.js";
import {
  validateAddItemToCart,
  validateGetCartByUser,
  validateUpdateCartItem,
  validateDeleteCartItem,
} from "../validations/cartValidation.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

router.use(authenticateToken);
router.post("/", validateAddItemToCart, validateRequest, addItemToCart);
router.get("/user/:userId", validateGetCartByUser, validateRequest, getCartByUser);
router.put("/:id", validateUpdateCartItem, validateRequest, updateCartItem);
router.delete("/:id", validateDeleteCartItem, validateRequest, deleteCartItem);

export default router;
