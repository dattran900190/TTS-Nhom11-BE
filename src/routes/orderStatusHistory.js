import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import {authenticateToken,authorizeRoles,} from "../middlewares/authMiddleware.js";
import {validateGetOrderStatusHistory,validateUpdateOrderStatusHistory,} from "../validations/OrderStatusHistoryValidate.js";
import {getOrderStatusHistory, updateOrderStatusNote} from "../controllers/orderStatusHistoryController.js";

const router = Router();

router.get("/", validateGetOrderStatusHistory, validateRequest, getOrderStatusHistory);
router.put("/edit/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateUpdateOrderStatusHistory,validateRequest,updateOrderStatusNote);
// router.get("/show/:id",authenticateToken,authorizeRoles("admin", "superadmin"),validateDetailProduct,validateRequest,getProductDetail);

export default router;
