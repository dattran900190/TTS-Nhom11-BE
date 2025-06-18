import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { validateGetBrand, validateCreateBrand, validateUpdateBrand, validateDeleteBrand, validateRestoreBrand, validatesoftDeleteBrand,} from "../validations/BrandValidate.js";
import { getBrand, createBrand, updateBrand, deleteBrand, softDeleteBrand, restoreBrand, } from "../controllers/brandController.js";

const router = Router();
const adminAuth = [authenticateToken, authorizeRoles("admin", "superadmin")];


router.get("/", validateGetBrand, validateRequest, getBrand);
router.post("/", adminAuth, validateCreateBrand, validateRequest, createBrand);
router.put("/:id", adminAuth, validateUpdateBrand, validateRequest, updateBrand);
router.delete("/:id", adminAuth, validateDeleteBrand, validateRequest, deleteBrand);
router.delete("/soft/:id", adminAuth, validatesoftDeleteBrand, validateRequest, softDeleteBrand);
router.patch("/restore/:id", adminAuth, validateRestoreBrand, validateRequest, restoreBrand);

export default router;
