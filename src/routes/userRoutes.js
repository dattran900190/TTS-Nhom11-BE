import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  validateCreateUser,
  validateUpdateUser,
  validateDeleteUser,
  validateGetUser,
} from "../validations/UserValidate.js";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();
const adminAuth = [authenticateToken, authorizeRoles("admin", "superadmin")];

router.get("/", adminAuth, validateGetUser, validateRequest, getUsers);
router.post("/", adminAuth, validateCreateUser, validateRequest, createUser);
router.put("/:id", adminAuth, validateUpdateUser, validateRequest, updateUser);
router.delete("/:id", adminAuth, validateDeleteUser, validateRequest, deleteUser);

export default router;
