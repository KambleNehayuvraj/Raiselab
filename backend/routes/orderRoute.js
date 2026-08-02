import express from "express"
import authMiddleware from "../middleware/auth.js"
import adminAuth from "../middleware/adminAuth.js"
import { placeOrder, listOrders, userOrders, updateStatus, createRazorpayOrder, verifyRazorpayPayment } from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.get("/userorders",authMiddleware,userOrders);
orderRouter.get("/list",adminAuth,listOrders);
orderRouter.post("/status",adminAuth,updateStatus);

// Razorpay online payment flow
orderRouter.post("/razorpay/create",authMiddleware,createRazorpayOrder);
orderRouter.post("/razorpay/verify",authMiddleware,verifyRazorpayPayment);

export default orderRouter;
