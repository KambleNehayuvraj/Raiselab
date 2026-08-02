import componentModel from "../models/componentModel.js";
import fs from 'fs';

// add component
const addComponent = async (req, res) => {
    if (!req.file) {
        return res.json({success:false,message:"No file uploaded"});
    }

    let image_filename = `${req.file.filename}`;

    const component = new componentModel({
        name: req.body.name,
        description: req.body.description || "",
        price: req.body.price,
        category: req.body.category,
        brand: req.body.brand || "",
        stock: req.body.stock || 0,
        image: image_filename
    })

    try {
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
        fs.unlink(`uploads/images/${component.image}`,()=>{})

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
            fs.unlink(`uploads/images/${existing.image}`, () => {});
            updateData.image = req.file.filename;
        }

        await componentModel.findByIdAndUpdate(req.body.id, updateData);
        res.json({success:true, message:"Component Updated"})
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

export {addComponent, listComponent, removeComponent, updateComponent}
