import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ElectronicComponents.css';

const CATEGORY_META = [
  { name: "Development Boards", icon: "🖥️" },
  { name: "Sensors", icon: "📡" },
  { name: "Motors & Drivers", icon: "⚙️" },
  { name: "Drone Parts", icon: "🚁" },
  { name: "Batteries & Power", icon: "🔋" },
  { name: "Electronic Modules", icon: "🔌" },
  { name: "ICs & Semiconductors", icon: "🧩" },
  { name: "Connectors & Cables", icon: "🔗" },
  { name: "Tools & Accessories", icon: "🛠️" },
];

const ElectronicComponents = () => {
  const { component_list, url, addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [addedId, setAddedId] = useState(null);

  const countFor = (categoryName) =>
    component_list.filter(c => c.category === categoryName).length;

  const productsInCategory = component_list
    .filter(c => c.category === activeCategory)
    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddToCart = async (comp) => {
    await addToCart({
      id: comp._id,
      name: comp.name,
      image: `${url}/images/${comp.image}`,
      price: Number(comp.price),
      category: comp.category,
      type: 'component'
    });
    setAddedId(comp._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="components-page">
      <div className="components-hero">
        <div className="components-hero-content">
          <h1>Electronic Components</h1>
          <p>Browse quality components for your next build — pick a category to get started.</p>
        </div>
        <div className="components-hero-actions">
          <button className="cart-action-btn" onClick={() => navigate('/cart')}>
            🛒 Go to Cart
          </button>
          <button className="checkout-action-btn" onClick={() => navigate('/order')}>
            Checkout
          </button>
        </div>
      </div>

      {!activeCategory ? (
        <div className="category-grid">
          {CATEGORY_META.map(cat => (
            <div
              key={cat.name}
              className="category-tile"
              onClick={() => setActiveCategory(cat.name)}
            >
              <div className="category-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <p>{countFor(cat.name)} item{countFor(cat.name) === 1 ? '' : 's'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="products-section">
          <div className="products-toolbar">
            <button className="back-btn" onClick={() => { setActiveCategory(null); setSearchTerm(''); }}>
              ← All Categories
            </button>
            <h2>{activeCategory}</h2>
            <input
              type="text"
              className="component-search"
              placeholder={`Search in ${activeCategory}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {productsInCategory.length === 0 ? (
            <div className="no-components">
              <p>No components added in this category yet.</p>
            </div>
          ) : (
            <div className="components-grid">
              {productsInCategory.map(comp => (
                <div key={comp._id} className="component-card">
                  <div className="component-image">
                    <img src={`${url}/images/${comp.image}`} alt={comp.name} />
                    {comp.stock <= 0 && <span className="out-of-stock-badge">Out of Stock</span>}
                  </div>
                  <div className="component-info">
                    {comp.brand && <span className="component-brand">{comp.brand}</span>}
                    <h4>{comp.name}</h4>
                    {comp.description && <p className="component-desc">{comp.description}</p>}
                    <div className="component-footer">
                      <span className="component-price">₹{comp.price}</span>
                      <button
                        className={`add-to-cart-btn ${addedId === comp._id ? 'added' : ''} ${isInCart(comp._id) ? 'in-cart' : ''}`}
                        onClick={() => (isInCart(comp._id) ? navigate('/cart') : handleAddToCart(comp))}
                        disabled={comp.stock <= 0}
                      >
                        {comp.stock <= 0
                          ? 'Unavailable'
                          : isInCart(comp._id)
                          ? '🛒 Go to Cart'
                          : addedId === comp._id
                          ? '✓ Added'
                          : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ElectronicComponents;
