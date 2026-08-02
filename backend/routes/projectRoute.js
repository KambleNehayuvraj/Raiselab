// routes/projectRoute.js
import express from "express";
import { addProject,listProject,removeProject,updateProject} from "../controllers/projectcontroller.js";
import multer from "multer";
import adminAuth from "../middleware/adminAuth.js";

const projectRouter = express.Router();

// Keep the uploaded file in memory (as a Buffer) instead of writing it
// to local disk - Render's disk is ephemeral and wipes on every
// redeploy/restart, so we stream the buffer straight to Cloudinary in
// the controller instead.
const upload = multer({ storage: multer.memoryStorage() });

projectRouter.post("/add",adminAuth,upload.single("image"),addProject)
projectRouter.get("/list",listProject)
projectRouter.post("/remove",adminAuth,removeProject);
projectRouter.post("/update",adminAuth,upload.single("image"),updateProject);

export default projectRouter;
