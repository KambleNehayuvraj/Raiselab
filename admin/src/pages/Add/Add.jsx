import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from "axios"
import { toast } from 'react-toastify';
import { handleAuthError } from '../../utils/authHandler';

const Add = ({url, token}) => {
  const [image, setImage] = useState(false)
  const [data, setData] = useState({
    name: "",
    description: "",
    longDescription: "",
    price: "",
    category: "Hardware",
    difficulty: "Intermediate",
    tags: "",          // comma separated
    features: "",      // one per line
    specifications: "",// one "key: value" per line
    github: "",
    demo: ""
  })

  const onchangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validate price before submitting
    if (!data.price || isNaN(data.price) || data.price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    // Parse tags: "IoT, Arduino, Sensors" -> ["IoT","Arduino","Sensors"]
    const tagsArray = data.tags
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    // Parse features: one per line
    const featuresArray = data.features
      .split("\n")
      .map(f => f.trim())
      .filter(Boolean);

    // Parse specifications: "Microcontroller: ESP32" per line -> {Microcontroller: "ESP32"}
    const specsObject = {};
    data.specifications
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .forEach(line => {
        const idx = line.indexOf(":");
        if (idx > -1) {
          const key = line.slice(0, idx).trim();
          const value = line.slice(idx + 1).trim();
          if (key) specsObject[key] = value;
        }
      });

    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("longDescription", data.longDescription)
    formData.append("price", Number(data.price))
    formData.append("category", data.category)
    formData.append("difficulty", data.difficulty)
    formData.append("tags", JSON.stringify(tagsArray))
    formData.append("features", JSON.stringify(featuresArray))
    formData.append("specifications", JSON.stringify(specsObject))
    formData.append("github", data.github)
    formData.append("demo", data.demo)
    formData.append("image", image)

    try {
      const response = await axios.post(`${url}/api/project/add`, formData, { headers: { token } });
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          longDescription: "",
          price: "",
          category: "Hardware",
          difficulty: "Intermediate",
          tags: "",
          features: "",
          specifications: "",
          github: "",
          demo: ""
        })
        setImage(false)
        toast.success(response.data.message)
        alert("Product added successfully!");
      }
      else if (!handleAuthError(response.data.message)) {
        alert(response.data.message || "Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    }
  }

  return (
    <div className="add">
      <div className="add-header">
        <h2>Add New Product</h2>
        <p>Fill in the details below to add a new project to your catalog</p>
      </div>

      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image" className="image-upload-container">
            <div className="upload-content">
              <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
              <span className="upload-text">Click to upload or drag and drop</span>
              <span className="upload-formats">PNG, JPG, GIF up to 10MB</span>
            </div>
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>

        <div className="form-row">
          <div className="add-product-name flex-col">
            <p>Project name</p>
            <input onChange={onchangeHandler} value={data.name} type="text" name='name' placeholder='Enter project name' required />
          </div>
        </div>

        <div className="add-product-description flex-col">
          <p>Short description</p>
          <p className="field-hint">Shown on the project listing card.</p>
          <textarea onChange={onchangeHandler} value={data.description} name="description" rows="4" placeholder='Describe your project in 1-2 sentences...' required></textarea>
        </div>

        <div className="add-product-description flex-col">
          <p>Long description</p>
          <p className="field-hint">Shown on the project detail page.</p>
          <textarea onChange={onchangeHandler} value={data.longDescription} name="longDescription" rows="4" placeholder='Detailed explanation of the project...'></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Project category</p>
            <select onChange={onchangeHandler} value={data.category} name="category">
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
            </select>
          </div>
          <div className="add-category flex-col">
            <p>Difficulty</p>
            <select onChange={onchangeHandler} value={data.difficulty} name="difficulty">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Project price (₹)</p>
            <input onChange={onchangeHandler} value={data.price} type="number" name='price' placeholder='8000' min="1" step="0.01" required />
          </div>
        </div>

        <div className="add-product-description flex-col">
          <p>Tags</p>
          <p className="field-hint">Comma separated, e.g: IoT, Arduino, Sensors. Also used for category filter chips (e.g. "IoT", "Embedded", "Robotics", "AI").</p>
          <input onChange={onchangeHandler} value={data.tags} type="text" name='tags' placeholder='IoT, Arduino, Sensors' />
        </div>

        <div className="add-product-description flex-col">
          <p>Features</p>
          <p className="field-hint">One feature per line.</p>
          <textarea onChange={onchangeHandler} value={data.features} name="features" rows="6" placeholder={"Real-time monitoring\nMobile app alerts\nCloud data logging"}></textarea>
        </div>

        <div className="add-product-description flex-col">
          <p>Specifications</p>
          <p className="field-hint">One per line, format "Key: Value".</p>
          <textarea onChange={onchangeHandler} value={data.specifications} name="specifications" rows="6" placeholder={"Microcontroller: ESP32 DevKit V1\nConnectivity: WiFi 802.11 b/g/n\nPower: 12V DC adapter"}></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>GitHub link (optional)</p>
            <input onChange={onchangeHandler} value={data.github} type="text" name='github' placeholder='https://github.com/...' />
          </div>
          <div className="add-category flex-col">
            <p>Demo link (optional)</p>
            <input onChange={onchangeHandler} value={data.demo} type="text" name='demo' placeholder='https://...' />
          </div>
        </div>

        <div className="form-actions">
          <button type='submit' className='add-btn'>
            <span>ADD PRODUCT</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default Add;
