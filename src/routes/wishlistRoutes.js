import express from "express";
import {
  getWishlistByUser,
  addWishlist,
  deleteWishlist,
} from "../controllers/wishlistController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/user/:user_id", authenticateToken, getWishlistByUser);
router.post("/", authenticateToken, addWishlist);
router.delete("/:id", authenticateToken, deleteWishlist);

export default router;
