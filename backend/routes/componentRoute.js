import express from "express";
import { addComponent, listComponent, removeComponent, updateComponent } from "../controllers/componentController.js";
import multer from "multer";
import adminAuth from "../middleware/adminAuth.js";

const componentRouter = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/images",
    filename:(req, file, cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
});

const upload = multer({storage:storage})

componentRouter.post("/add", adminAuth, upload.single("image"), addComponent)
componentRouter.get("/list", listComponent)
componentRouter.post("/remove", adminAuth, removeComponent);
componentRouter.post("/update", adminAuth, upload.single("image"), updateComponent);

export default componentRouter;
