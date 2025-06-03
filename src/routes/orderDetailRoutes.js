import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  // validateCreateOrderDetail,
  validateUpdateOrderDetail,
  // validateDeleteOrderDetail,
  validateGetOrderDetails,
} from "../validations/OrderDetailValidate.js";
import {
  getOrderDetails,
  // createOrderDetail,
  updateOrderDetail,
  // deleteOrderDetail,
} from "../controllers/orderDetailController.js";

const router = Router();

router.get( "/", authenticateToken, authorizeRoles("admin", "superadmin"), validateGetOrderDetails, validateRequest, getOrderDetails );
// router.post( "/orders/:id/details", authenticateToken, authorizeRoles("admin", "superadmin"), validateCreateOrderDetail, validateRequest, createOrderDetail );
router.put( "/:order_detail_id", authenticateToken, authorizeRoles("admin", "superadmin"), validateUpdateOrderDetail, validateRequest, updateOrderDetail );
// router.delete( "/order-details/:order_detail_id", authenticateToken, authorizeRoles("admin", "superadmin"), validateDeleteOrderDetail, validateRequest, deleteOrderDetail );

export default router;
