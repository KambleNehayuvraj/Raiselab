import React, { useState } from 'react';
import '../Add/Add.css';
import { assets } from '../../assets/assets';
import axios from "axios"
import { toast } from 'react-toastify';
import { handleAuthError } from '../../utils/authHandler';

export const COMPONENT_CATEGORIES = [
  "Development Boards",
  "Sensors",
  "Motors & Drivers",
  "Drone Parts",
  "Batteries & Power",
  "Electronic Modules",
  "ICs & Semiconductors",
  "Connectors & Cables",
  "Tools & Accessories"
];

const AddComponent = ({url, token}) => {
  const [image, setImage] = useState(false)
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: COMPONENT_CATEGORIES[0],
    brand: "",
    stock: ""
  })

  const onchangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!data.price || isNaN(data.price) || data.price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", Number(data.price))
    formData.append("category", data.category)
    formData.append("brand", data.brand)
    formData.append("stock", Number(data.stock) || 0)
    formData.append("image", image)

    try {
      const response = await axios.post(`${url}/api/component/add`, formData, { headers: { token } });
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: COMPONENT_CATEGORIES[0],
          brand: "",
          stock: ""
        })
        setImage(false)
        toast.success(response.data.message)
      }
      else if (!handleAuthError(response.data.message)) {
        toast.error(response.data.message || "Failed to add component");
      }
    } catch (error) {
      console.error("Error adding component:", error);
      toast.error("An error occurred while adding the component.");
    }
  }

  return (
    <div className="add">
      <div className="add-header">
        <h2>Add Electronic Component</h2>
        <p>Add a new component to your parts store</p>
      </div>

      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="component-image" className="image-upload-container">
            <div className="upload-content">
              <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
              <span className="upload-text">Click to upload or drag and drop</span>
              <span className="upload-formats">PNG, JPG, GIF up to 10MB</span>
            </div>
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="component-image" hidden required />
        </div>

        <div className="form-row">
          <div className="add-product-name flex-col">
            <p>Component name</p>
            <input onChange={onchangeHandler} value={data.name} type="text" name='name' placeholder='e.g. Arduino Uno R3' required />
          </div>
        </div>

        <div className="add-product-description flex-col">
          <p>Description</p>
          <textarea onChange={onchangeHandler} value={data.description} name="description" rows="4" placeholder='Short description of the component...'></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Category</p>
            <select onChange={onchangeHandler} value={data.category} name="category">
              {COMPONENT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="add-category flex-col">
            <p>Brand (optional)</p>
            <input onChange={onchangeHandler} value={data.brand} type="text" name='brand' placeholder='e.g. Texas Instruments' />
          </div>
        </div>

        <div className="add-category-price">
          <div className="add-price flex-col">
            <p>Price (₹)</p>
            <input onChange={onchangeHandler} value={data.price} type="number" name='price' placeholder='299' min="1" step="0.01" required />
          </div>
          <div className="add-price flex-col">
            <p>Stock quantity</p>
            <input onChange={onchangeHandler} value={data.stock} type="number" name='stock' placeholder='50' min="0" step="1" />
          </div>
        </div>

        <div className="form-actions">
          <button type='submit' className='add-btn'>
            <span>ADD COMPONENT</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddComponent;
