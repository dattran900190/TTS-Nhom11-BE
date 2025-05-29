import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  validateCreateUser,
  validateUpdateUser,
  validateDeleteUser,
  validateGetUser,
} from "../validations/UserValidate.js";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js";

const router = Router();

router.get(
  "/users",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateGetUser,
  validateRequest,
  getUsers
);
router.post(
  "/users/create",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateCreateUser,
  validateRequest,
  createUser
);
router.put(
  "/users/edit/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateUpdateUser,
  validateRequest,
  updateUser
);
router.delete(
  "/users/delete/:id",
  authenticateToken,
  authorizeRoles("admin", "superadmin"),
  validateDeleteUser,
  validateRequest,
  deleteUser
);

export default router;
