import express from "express";
import { addComponent, listComponent, removeComponent, updateComponent } from "../controllers/componentController.js";
import multer from "multer";
import adminAuth from "../middleware/adminAuth.js";

const componentRouter = express.Router();

// Keep the uploaded file in memory (as a Buffer) instead of writing it
// to local disk - Render's disk is ephemeral and wipes on every
// redeploy/restart, so we stream the buffer straight to Cloudinary in
// the controller instead.
const upload = multer({ storage: multer.memoryStorage() });

componentRouter.post("/add", adminAuth, upload.single("image"), addComponent)
componentRouter.get("/list", listComponent)
componentRouter.post("/remove", adminAuth, removeComponent);
componentRouter.post("/update", adminAuth, upload.single("image"), updateComponent);

export default componentRouter;
