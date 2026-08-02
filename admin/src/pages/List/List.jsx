import React, { useEffect, useState } from 'react'
import './List.css'
import '../Add/Add.css'
import axios from "axios"
import { toast } from 'react-toastify'
import { handleAuthError } from '../../utils/authHandler'

const emptyForm = {
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
};

const List = ({url, token}) => {
  const [list,setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(emptyForm);
  const [editImage, setEditImage] = useState(false);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/project/List`);
    if(response.data.success) {
      setList(response.data.data);
    }
    else{
      toast.error("Error")
    }
  }

  const removeProject = async(projectId) => {
    const response = await axios.post(`${url}/api/project/remove`,{id:projectId},{ headers: { token } });
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
      longDescription: item.longDescription || "",
      price: item.price ?? "",
      category: item.category || "Hardware",
      difficulty: item.difficulty || "Intermediate",
      tags: (item.tags || []).join(", "),
      features: (item.features || []).join("\n"),
      specifications: Object.entries(item.specifications || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n"),
      github: item.github || "",
      demo: item.demo || ""
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

    const tagsArray = editData.tags.split(",").map(t => t.trim()).filter(Boolean);
    const featuresArray = editData.features.split("\n").map(f => f.trim()).filter(Boolean);

    const specsObject = {};
    editData.specifications
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
    formData.append("id", editingId);
    formData.append("name", editData.name);
    formData.append("description", editData.description);
    formData.append("longDescription", editData.longDescription);
    formData.append("price", Number(editData.price));
    formData.append("category", editData.category);
    formData.append("difficulty", editData.difficulty);
    formData.append("tags", JSON.stringify(tagsArray));
    formData.append("features", JSON.stringify(featuresArray));
    formData.append("specifications", JSON.stringify(specsObject));
    formData.append("github", editData.github);
    formData.append("demo", editData.demo);
    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      const response = await axios.post(`${url}/api/project/update`, formData, { headers: { token } });
      if (response.data.success) {
        toast.success(response.data.message);
        closeEdit();
        await fetchList();
      } else if (!handleAuthError(response.data.message)) {
        toast.error(response.data.message || "Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("An error occurred while updating the product.");
    }
  }

  useEffect(()=>{
    fetchList();
  },[])
  return (
    <div className='list flex-col'>
      <p>All Projects List</p>
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
                <button type="button" onClick={()=>removeProject(item._id)} className='remove-btn'>Remove Project</button>
              </div>
            </div>
          )

        })}
      </div>

      {editingId && (
        <div className="edit-modal-backdrop" onClick={closeEdit}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h3>Edit Project</h3>
              <span className="edit-modal-close cursor" onClick={closeEdit}>×</span>
            </div>

            <form className="flex-col" onSubmit={submitEdit}>
              <div className="add-img-upload flex-col">
                <p>Replace image (optional)</p>
                <label htmlFor="edit-image" className="image-upload-container">
                  <div className="upload-content">
                    <img
                      src={editImage ? URL.createObjectURL(editImage) : list.find(i => i._id === editingId)?.image}
                      alt=""
                    />
                    <span className="upload-text">Click to replace image</span>
                  </div>
                </label>
                <input onChange={(e) => setEditImage(e.target.files[0])} type="file" id="edit-image" hidden />
              </div>

              <div className="add-product-name flex-col">
                <p>Project name</p>
                <input onChange={onEditChange} value={editData.name} type="text" name='name' required />
              </div>

              <div className="add-product-description flex-col">
                <p>Short description</p>
                <textarea onChange={onEditChange} value={editData.description} name="description" rows="3" required></textarea>
              </div>

              <div className="add-product-description flex-col">
                <p>Long description</p>
                <textarea onChange={onEditChange} value={editData.longDescription} name="longDescription" rows="3"></textarea>
              </div>

              <div className="add-category-price">
                <div className="add-category flex-col">
                  <p>Category</p>
                  <select onChange={onEditChange} value={editData.category} name="category">
                    <option value="Software">Software</option>
                    <option value="Hardware">Hardware</option>
                  </select>
                </div>
                <div className="add-category flex-col">
                  <p>Difficulty</p>
                  <select onChange={onEditChange} value={editData.difficulty} name="difficulty">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div className="add-price flex-col">
                  <p>Price (₹)</p>
                  <input onChange={onEditChange} value={editData.price} type="number" name='price' min="1" step="0.01" required />
                </div>
              </div>

              <div className="add-product-description flex-col">
                <p>Tags (comma separated)</p>
                <input onChange={onEditChange} value={editData.tags} type="text" name='tags' />
              </div>

              <div className="add-product-description flex-col">
                <p>Features (one per line)</p>
                <textarea onChange={onEditChange} value={editData.features} name="features" rows="5"></textarea>
              </div>

              <div className="add-product-description flex-col">
                <p>Specifications (one per line, "Key: Value")</p>
                <textarea onChange={onEditChange} value={editData.specifications} name="specifications" rows="5"></textarea>
              </div>

              <div className="add-category-price">
                <div className="add-category flex-col">
                  <p>GitHub link</p>
                  <input onChange={onEditChange} value={editData.github} type="text" name='github' />
                </div>
                <div className="add-category flex-col">
                  <p>Demo link</p>
                  <input onChange={onEditChange} value={editData.demo} type="text" name='demo' />
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

export default List
