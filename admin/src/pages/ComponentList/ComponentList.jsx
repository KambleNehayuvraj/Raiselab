import React, { useEffect, useState } from 'react'
import '../List/List.css'
import '../Add/Add.css'
import axios from "axios"
import { toast } from 'react-toastify'
import { COMPONENT_CATEGORIES } from '../AddComponent/AddComponent'
import { handleAuthError } from '../../utils/authHandler'

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: COMPONENT_CATEGORIES[0],
  brand: "",
  stock: ""
};

const ComponentList = ({url, token}) => {
  const [list,setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(emptyForm);
  const [editImage, setEditImage] = useState(false);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/component/list`);
    if(response.data.success) {
      setList(response.data.data);
    }
    else{
      toast.error("Error")
    }
  }

  const removeComponent = async(id) => {
    const response = await axios.post(`${url}/api/component/remove`,{id},{ headers: { token } });
    if (handleAuthError(response.data.message)) return;
    await fetchList();
    if(response.data.success){
      toast.success(response.data.message)
    }
    else{
      toast.error(response.data.message || "Error");
    }
  }

  const openEdit = (item) => {
    setEditingId(item._id);
    setEditImage(false);
    setEditData({
      name: item.name || "",
      description: item.description || "",
      price: item.price ?? "",
      category: item.category || COMPONENT_CATEGORIES[0],
      brand: item.brand || "",
      stock: item.stock ?? ""
    });
  }

  const closeEdit = () => {
    setEditingId(null);
    setEditData(emptyForm);
    setEditImage(false);
  }

  const onEditChange = (event) => {
    const { name, value } = event.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  }

  const submitEdit = async (event) => {
    event.preventDefault();

    if (!editData.price || isNaN(editData.price) || editData.price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    const formData = new FormData();
    formData.append("id", editingId);
    formData.append("name", editData.name);
    formData.append("description", editData.description);
    formData.append("price", Number(editData.price));
    formData.append("category", editData.category);
    formData.append("brand", editData.brand);
    formData.append("stock", Number(editData.stock) || 0);
    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      const response = await axios.post(`${url}/api/component/update`, formData, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        closeEdit();
        await fetchList();
      } else if (!handleAuthError(response.data.message)) {
        toast.error(response.data.message || "Failed to update component");
      }
    } catch (error) {
      console.error("Error updating component:", error);
      toast.error("An error occurred while updating the component.");
    }
  }

  useEffect(()=>{
    fetchList();
  },[])

  return (
    <div className='list flex-col'>
      <p>All Components List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item,index)=>{
          return(
            <div key={index} className='list-table-format'>
              <img src={item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <div className="list-actions">
                <button type="button" onClick={()=>openEdit(item)} className='edit-btn'>Edit</button>
                <button type="button" onClick={()=>removeComponent(item._id)} className='remove-btn'>Remove</button>
              </div>
            </div>
          )
        })}
      </div>

      {editingId && (
        <div className="edit-modal-backdrop" onClick={closeEdit}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h3>Edit Component</h3>
              <button type="button" className="edit-modal-close cursor" onClick={closeEdit}>×</button>
            </div>

            <form className="flex-col" onSubmit={submitEdit}>
              <div className="add-img-upload flex-col">
                <p>Replace image (optional)</p>
                <label htmlFor="edit-component-image" className="image-upload-container">
                  <div className="upload-content">
                    <img
                      src={editImage ? URL.createObjectURL(editImage) : list.find(i => i._id === editingId)?.image}
                      alt=""
                    />
                    <span className="upload-text">Click to replace image</span>
                  </div>
                </label>
                <input onChange={(e) => setEditImage(e.target.files[0])} type="file" id="edit-component-image" hidden />
              </div>

              <div className="add-product-name flex-col">
                <p>Component name</p>
                <input onChange={onEditChange} value={editData.name} type="text" name='name' required />
              </div>

              <div className="add-product-description flex-col">
                <p>Description</p>
                <textarea onChange={onEditChange} value={editData.description} name="description" rows="3"></textarea>
              </div>

              <div className="add-category-price">
                <div className="add-category flex-col">
                  <p>Category</p>
                  <select onChange={onEditChange} value={editData.category} name="category">
                    {COMPONENT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="add-category flex-col">
                  <p>Brand</p>
                  <input onChange={onEditChange} value={editData.brand} type="text" name='brand' />
                </div>
              </div>

              <div className="add-category-price">
                <div className="add-price flex-col">
                  <p>Price (₹)</p>
                  <input onChange={onEditChange} value={editData.price} type="number" name='price' min="1" step="0.01" required />
                </div>
                <div className="add-price flex-col">
                  <p>Stock quantity</p>
                  <input onChange={onEditChange} value={editData.stock} type="number" name='stock' min="0" step="1" />
                </div>
              </div>

              <div className="form-actions">
                <button type='button' className='cancel-btn' onClick={closeEdit}>Cancel</button>
                <button type='submit' className='add-btn'><span>SAVE CHANGES</span></button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ComponentList
