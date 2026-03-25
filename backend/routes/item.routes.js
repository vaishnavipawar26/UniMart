import express from "express";
import {isAuth} from "../middleware/isAuth.js";
import { addItem, deleteItem, editItem, getItemById, getItemByShopType, rating, searchItems } from "../controllers/item.controllers.js";
import upload from "../middleware/multer.js"; 

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRouter.post("/get-item-id/:itemId", isAuth,  getItemById);
itemRouter.delete("/delete/:itemId", isAuth, deleteItem);
itemRouter.get("/get-by-shoptype/:shopType",isAuth,getItemByShopType);
itemRouter.get("/search-items",isAuth,searchItems);
itemRouter.post("/rating",isAuth,rating);

export default itemRouter;
