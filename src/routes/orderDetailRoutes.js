import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";

import {
  validateUpdateOrderDetail,
  validateGetOrderDetails,
  // validateCreateOrderDetail,
  // validateDeleteOrderDetail,
} from "../validations/OrderDetailValidate.js";

import {
  getOrderDetails,
  updateOrderDetail,
  // createOrderDetail,
  // deleteOrderDetail,
} from "../controllers/orderDetailController.js";

const router = Router();
const adminAuth = [authenticateToken, authorizeRoles("admin", "superadmin")];

router.get("/", adminAuth, validateGetOrderDetails, validateRequest, getOrderDetails);
router.put("/:order_detail_id", adminAuth, validateUpdateOrderDetail, validateRequest, updateOrderDetail);
// router.post("/", adminAuth, validateCreateOrderDetail, validateRequest, createOrderDetail);
// router.delete("/:order_detail_id", adminAuth, validateDeleteOrderDetail, validateRequest, deleteOrderDetail);

export default router;
