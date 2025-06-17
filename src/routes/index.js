import { Router } from "express";
import authRoutes from "./authRoutes.js";
import brandRoutes from "./brandRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import orderRoutes from "./orderRoutes.js";
import orderDetailRoutes from "./orderDetailRoutes.js";
import productRoutes from "./productRoutes.js";
import userRoutes from "./userRoutes.js";
import variantRoutes from "./variantRoutes.js";
import cartRoutes from "./cartRoutes.js";
import reviewRoutes from "./reviewsRoutes.js";
const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/brands", brandRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/orders", orderRoutes);
routes.use("/order-details", orderDetailRoutes);
routes.use("/products", productRoutes);
routes.use("/users", userRoutes);
routes.use("/variants", variantRoutes);
routes.use("/cart", cartRoutes);
routes.use("/reviews", reviewRoutes);

export default routes;
