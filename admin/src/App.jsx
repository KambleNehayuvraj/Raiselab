import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Login from './pages/Login/Login'
import AddComponent from './pages/AddComponent/AddComponent'
import ComponentList from './pages/ComponentList/ComponentList'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {

  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
  const [token, setToken] = useState(localStorage.getItem("admin-token") || "")

  if (!token) {
    return (
      <div>
        <ToastContainer/>
        <Login url={url} setToken={setToken}/>
      </div>
    )
  }

  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr/>
      <div className="app-content">
        <Sidebar/>
        <Routes>
          <Route path='/add' element={<Add url={url} token={token}/>} />
          <Route path='/List' element={<List url={url} token={token}/>} />
          <Route path='/Orders' element={<Orders url={url} token={token}/>} />
          <Route path='/add-component' element={<AddComponent url={url} token={token}/>} />
          <Route path='/component-list' element={<ComponentList url={url} token={token}/>} />
        </Routes>

      </div>
      
    </div>
  )
}

export default App
