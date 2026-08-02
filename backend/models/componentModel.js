import mongoose from "mongoose";

const componentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, default: ""},
    price: {type: Number, required: true},
    image: {type: String, required: true},
    imagePublicId: {type: String, default: ""}, // Cloudinary public_id, used to delete the image later
    category: {type: String, required: true},
    brand: {type: String, default: ""},
    stock: {type: Number, default: 0},
})

const componentModel = mongoose.models.component || mongoose.model("component", componentSchema)

export default componentModel;
