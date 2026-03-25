import express from "express";
import { updateShopType } from "../controllers/vendor.controller.js";
import {isAuth} from "../middleware/isAuth.js"; 

const router = express.Router();

router.put("/updateShopType", isAuth, updateShopType);

export default router;
