import React, { useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      {/* Toggle Button for mobile */}
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>

      <div className={`Sidebar ${showSidebar ? 'show' : ''}`}>
        <div className="Sidebar-options">
          <NavLink to='/add'className="Sidebar-option">
            <img src={assets.add_icon} alt="Add" />
            <p>Add items</p>
          </NavLink>
          <NavLink to='/list'className="Sidebar-option">
            <img src={assets.list_item} alt="List" />
            <p>List items</p>
          </NavLink>
          <NavLink to='/add-component'className="Sidebar-option">
            <img src={assets.add_icon} alt="Add Component" />
            <p>Add Component</p>
          </NavLink>
          <NavLink to='/component-list'className="Sidebar-option">
            <img src={assets.list_item} alt="Component List" />
            <p>Component List</p>
          </NavLink>
          <NavLink to='/orders'className="Sidebar-option">
            <img src={assets.order_icon} alt="Orders" />
            <p>Orders</p>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
