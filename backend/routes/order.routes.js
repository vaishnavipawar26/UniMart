import express from "express";
import { acceptOrder, getCurrentOrder, getDeliveryBoyAssignment, getMyOrders, placeOrder, sendDeliveryOtp, updateOrderStatus, verifyDeliveryOtp } from "../controllers/order.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import upload from "../middleware/multer.js"; 

const orderRouter = express.Router();

orderRouter.post("/placeorder",isAuth,placeOrder);
orderRouter.get("/myorder",isAuth,getMyOrders);
orderRouter.post("/update-status/:orderId/:shopId",isAuth,updateOrderStatus);
orderRouter.get("/get-assignments", isAuth, getDeliveryBoyAssignment);
orderRouter.get("/accept-order/:assignmentId",isAuth,acceptOrder);
orderRouter.get("/getcurrent-order",isAuth,getCurrentOrder);
orderRouter.post("/send-delivery-otp",isAuth,sendDeliveryOtp);
orderRouter.post("/verify-delivery-otp",isAuth,verifyDeliveryOtp);



export default orderRouter;
