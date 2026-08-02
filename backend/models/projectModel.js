import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    longDescription: {type: String, default: ""},
    price: {type: Number, required: true}, // Fixed: Number not number
    image: {type: String, required: true},
    category: {type: String, required: true}, // "Hardware" or "Software"
    difficulty: {type: String, default: "Intermediate"},
    tags: {type: [String], default: []},
    features: {type: [String], default: []},
    specifications: {type: Map, of: String, default: {}},
    github: {type: String, default: ""},
    demo: {type: String, default: ""},
})

const projectModel = mongoose.models.project || mongoose.model("project", projectSchema) // Fixed: model not Model

export default projectModel;