import componentModel from "../models/componentModel.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// add component
const addComponent = async (req, res) => {
    if (!req.file) {
        return res.json({success:false,message:"No file uploaded"});
    }

    try {
        const { url, public_id } = await uploadBufferToCloudinary(req.file.buffer, "projify/components");

        const component = new componentModel({
            name: req.body.name,
            description: req.body.description || "",
            price: req.body.price,
            category: req.body.category,
            brand: req.body.brand || "",
            stock: req.body.stock || 0,
            image: url,
            imagePublicId: public_id
        })

        await component.save();
        res.json({success:true, message:"Component Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}

// list all components
const listComponent = async (req,res) => {
    try{
        const components = await componentModel.find({});
        res.json({success:true, data:components})
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

// remove component
const removeComponent = async (req,res) => {
    try{
        const component = await componentModel.findById(req.body.id);
        await deleteFromCloudinary(component.imagePublicId);

        await componentModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:"Component Removed"})
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

// update component
const updateComponent = async (req,res) => {
    try{
        const existing = await componentModel.findById(req.body.id);
        if (!existing) {
            return res.json({success:false,message:"Component not found"});
        }

        const updateData = {
            name: req.body.name ?? existing.name,
            description: req.body.description ?? existing.description,
            price: req.body.price ?? existing.price,
            category: req.body.category ?? existing.category,
            brand: req.body.brand ?? existing.brand,
            stock: req.body.stock ?? existing.stock,
        };

        if (req.file) {
            const { url, public_id } = await uploadBufferToCloudinary(req.file.buffer, "projify/components");
            await deleteFromCloudinary(existing.imagePublicId);
            updateData.image = url;
            updateData.imagePublicId = public_id;
        }

        await componentModel.findByIdAndUpdate(req.body.id, updateData);
        res.json({success:true, message:"Component Updated"})
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

export {addComponent, listComponent, removeComponent, updateComponent}
