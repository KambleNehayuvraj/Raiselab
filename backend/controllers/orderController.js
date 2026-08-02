import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Razorpay from "razorpay";
import crypto from "crypto";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.userId, // from authMiddleware - trust the token, not client-supplied body
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: req.body.payment || false,
            paymentMethod: "cod"
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        return res.json({ success: true, message: "Order placed successfully", orderId: newOrder._id });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error placing order" });
    }
};

// Step 1 of online payment: create a Razorpay order for the given amount.
// This does NOT create an order in our own DB yet - that only happens
// after the payment signature is verified below.
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body; // amount in rupees (₹)

        if (!amount || amount <= 0) {
            return res.json({ success: false, message: "Invalid amount" });
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        return res.json({
            success: true,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: process.env.RAZORPAY_KEY_ID // public key id, safe to send to frontend
        });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error creating Razorpay order" });
    }
};

// Step 2 of online payment: verify the payment signature Razorpay sends back,
// and only then save the actual order in our DB and clear the cart.
const verifyRazorpayPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
            amount,
            address
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.json({ success: false, message: "Missing payment details" });
        }

        // Recreate the expected signature server-side using our secret key.
        // NEVER trust a "payment succeeded" flag sent directly from the frontend.
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.json({ success: false, message: "Payment verification failed" });
        }

        // Signature valid - payment is genuine. Now create the order record.
        const newOrder = new orderModel({
            userId: req.userId,
            items,
            amount,
            address,
            payment: true,
            paymentMethod: "razorpay",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        return res.json({
            success: true,
            message: "Payment verified and order placed successfully",
            orderId: newOrder._id
        });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error verifying payment" });
    }
};

// admin: list all orders
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// user: list this user's own orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId }).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// admin: update order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { placeOrder, listOrders, userOrders, updateStatus, createRazorpayOrder, verifyRazorpayPayment };
