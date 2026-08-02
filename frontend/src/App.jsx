import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import HowItWorks from './pages/Howitworks/Howitworks'
import AboutUs from './pages/AboutUs/Aboutus'
import RequestProject from './pages/RequestProject/RequestProject'
import HardwareProject from './pages/HardwareProjects/HardwareProjects'
import ProjectDetail from './pages/HardwareProjects/ProjectDetail/ProjectDetail'
import Cart from './pages/Cart/Cart'
import SoftwareProject from './pages/SoftwareProject/SoftwareProjects'
import SoftwareProjectDetail from './pages/SoftwareProject/SoftwareProjectDetail/SoftwareProjectDetail'
import Projects from './Projects' // Import your new Projects component
import ElectronicComponents from './pages/ElectronicComponents/ElectronicComponents'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
        
  return (
    <CartProvider>
      <Navbar />
      <div className='app'>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/how-it-works' element={<HowItWorks/>} />
          <Route path='/about' element={<AboutUs/>} />
          <Route path='/order' element={<PlaceOrder/>} />
          <Route path='/Requestpro' element={<RequestProject/>} />
          <Route path='/request-project' element={<RequestProject/>} />
          <Route path='/projects' element={<Projects/>} /> {/* New route for all projects */}
          <Route path='/hardware-projects' element={<HardwareProject/>} />
          <Route path="/hardware-project/:id" element={<ProjectDetail/>} />
          <Route path='/software-projects' element={<SoftwareProject/>} />
          <Route path='/SoftwareProjectDetail/:id' element={<SoftwareProjectDetail/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/components" element={<ElectronicComponents/>} />
        </Routes>
      </div>
      <Footer />
    </CartProvider>
  )
}

export default App