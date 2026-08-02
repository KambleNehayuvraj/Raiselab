// server.js - Updated version with cart routes
import express from "express";
import cors from "cors";
import dns from "dns";
import { connectDB } from "./config/db.js";
import projectRouter from "./routes/projectRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";  // Add this import
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import 'dotenv/config'
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import componentRouter from "./routes/componentRoute.js";

// Force Node's DNS resolver to use Google/Cloudflare directly - fixes
// "querySrv ECONNREFUSED" when the OS-configured DNS server doesn't
// handle mongodb+srv:// SRV lookups correctly (common on Windows)
dns.setServers(["8.8.8.8", "1.1.1.1"]);


console.log('Environment check:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('Current working directory:', process.cwd());

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App config
const app = express();
const port = process.env.PORT || 4000;


// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "https://projify-platform-2.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://raiselab-admin.onrender.com"
  ],
  credentials: true
}));


// DB connection
connectDB();

// API endpoints
app.use("/api/project", projectRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);  // Add this line
app.use("/api/order",orderRouter)
app.use("/api/admin", adminRouter)
app.use("/api/component", componentRouter)

// Static file serving with absolute path
app.use("/images", express.static(path.join(__dirname, 'uploads', 'images')));

app.get("/", (req, res) => {
    res.send("API Working")
});

app.listen(port, () => {
    console.log(`✅ Server started on port ${port}`);
});

