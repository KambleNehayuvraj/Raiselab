// controllers/projectController.js - Enhanced with file verification
import projectModel from "../models/projectModel.js";
import fs from 'fs';

// Add project item
const addProject = async (req, res) => {
    console.log('req.file:', req.file);  // Add this line
    console.log('req.body:', req.body);
    if (!req.file) {
        return res.json({success:false,message:"No file uploaded"});
    }
    
    let image_filename = `${req.file.filename}`;

    // tags, features, and specifications arrive as JSON strings from FormData
    let tags = [];
    let features = [];
    let specifications = {};

    try {
        if (req.body.tags) tags = JSON.parse(req.body.tags);
    } catch (e) { console.log('tags parse error:', e); }

    try {
        if (req.body.features) features = JSON.parse(req.body.features);
    } catch (e) { console.log('features parse error:', e); }

    try {
        if (req.body.specifications) specifications = JSON.parse(req.body.specifications);
    } catch (e) { console.log('specifications parse error:', e); }

    const project = new projectModel({
        name:req.body.name,
        description:req.body.description,
        longDescription:req.body.longDescription || "",
        price:req.body.price,
        category:req.body.category,
        image:image_filename,
        difficulty:req.body.difficulty || "Intermediate",
        tags,
        features,
        specifications,
        github:req.body.github || "",
        demo:req.body.demo || ""
    })
    try {
        await project.save();
        res.json({success:true,message:"Project Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

// all project list 
const listProject = async (req,res) => {
    try{
        const projects = await projectModel.find({});
        res.json({success:true,data:projects})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// remove projects 
const removeProject = async (req,res) => {
    try{
        const project = await projectModel.findById(req.body.id);
        fs.unlink(`uploads/images/${project.image}`,()=>{})

        await projectModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Project Removed"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})

    }

}

// update project
const updateProject = async (req,res) => {
    try{
        const existing = await projectModel.findById(req.body.id);
        if (!existing) {
            return res.json({success:false,message:"Project not found"});
        }

        let tags = existing.tags;
        let features = existing.features;
        let specifications = existing.specifications;

        try {
            if (req.body.tags) tags = JSON.parse(req.body.tags);
        } catch (e) { console.log('tags parse error:', e); }

        try {
            if (req.body.features) features = JSON.parse(req.body.features);
        } catch (e) { console.log('features parse error:', e); }

        try {
            if (req.body.specifications) specifications = JSON.parse(req.body.specifications);
        } catch (e) { console.log('specifications parse error:', e); }

        const updateData = {
            name: req.body.name ?? existing.name,
            description: req.body.description ?? existing.description,
            longDescription: req.body.longDescription ?? existing.longDescription,
            price: req.body.price ?? existing.price,
            category: req.body.category ?? existing.category,
            difficulty: req.body.difficulty ?? existing.difficulty,
            tags,
            features,
            specifications,
            github: req.body.github ?? existing.github,
            demo: req.body.demo ?? existing.demo,
        };

        // Only replace the image if a new file was uploaded
        if (req.file) {
            fs.unlink(`uploads/images/${existing.image}`, () => {});
            updateData.image = req.file.filename;
        }

        await projectModel.findByIdAndUpdate(req.body.id, updateData);
        res.json({success:true,message:"Project Updated"})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {addProject,listProject,removeProject,updateProject}