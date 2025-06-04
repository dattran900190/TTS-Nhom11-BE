import { Router } from "express";
import validateRequest from "../middlewares/validateRequest.js";
import { authenticateToken, authorizeRoles } from "../middlewares/authMiddleware.js";
import { validateGetBrand, validateCreateBrand, validateUpdateBrand, validateDeleteBrand, validateRestoreBrand, validatesoftDeleteBrand,} from "../validations/BrandValidate.js";
import { getBrand, createBrand, updateBrand, deleteBrand, softDeleteBrand, restoreBrand, } from "../controllers/brandController.js";

const router = Router();

router.get("/", validateGetBrand, validateRequest, getBrand);
router.post( "/create", authenticateToken, authorizeRoles("admin", "superadmin"), validateCreateBrand, validateRequest, createBrand );
router.put( "/edit/:id", authenticateToken, authorizeRoles("admin", "superadmin"), validateUpdateBrand, validateRequest, updateBrand );
router.delete( "/delete/:id", authenticateToken, authorizeRoles("admin", "superadmin"), validateDeleteBrand, validateRequest, deleteBrand );
router.delete( "/soft-delete/:id", authenticateToken, authorizeRoles("admin", "superadmin"), validatesoftDeleteBrand, validateRequest, softDeleteBrand );
router.patch( "/restore/:id", authenticateToken, authorizeRoles("admin", "superadmin"), validateRestoreBrand, validateRequest, restoreBrand );

export default router;
