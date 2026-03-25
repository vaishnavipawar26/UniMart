import express from "express";
import { EditShop, getMyShop, getPrintShops } from "../controllers/shop.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const shopRouter = express.Router();

shopRouter.post("/edit-shop", isAuth, upload.single("image"), EditShop);
shopRouter.get("/get-my", isAuth, getMyShop);
shopRouter.get("/printshops", isAuth, getPrintShops);

export default shopRouter;
