import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount,
    getCartTotal
  } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    // Navigate to checkout or order page
    navigate('/order');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  // Helper function to format currency
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Calculate fees and totals
  const subtotal = getCartTotal();
  const processingFee = 500; // ₹500 processing fee
  const taxRate = 0.18; // 18% GST (Indian tax rate)
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + processingFee + taxAmount;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z"/>
              </svg>
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any projects to your cart yet.</p>
            <button className="continue-shopping-btn" onClick={handleContinueShopping}>
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{getCartItemsCount()} {getCartItemsCount() === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-items-header">
              <span>Project</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Action</span>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <div className="item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="placeholder-image">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                          <path d="M2 17L12 22L22 17" />
                          <path d="M2 12L12 17L22 12" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-description">{item.description || 'Custom project'}</p>
                    <span className="item-category">{item.category || 'Hardware Project'}</span>
                    {item.difficulty && (
                      <span className="item-difficulty">{item.difficulty}</span>
                    )}
                  </div>
                </div>

                <div className="item-price">
                  {formatPrice(item.price)}
                </div>

                <div className="item-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity || 1}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  {formatPrice(item.price * (item.quantity || 1))}
                </div>

                <div className="item-actions">
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Remove item"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal ({getCartItemsCount()} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="summary-row">
                <span>Processing Fee</span>
                <span>{formatPrice(processingFee)}</span>
              </div>

              <div className="summary-row">
                <span>GST (18%)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>

              <div className="cart-actions">
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
                <button className="continue-shopping-btn" onClick={handleContinueShopping}>
                  Continue Shopping
                </button>
                <button className="clear-cart-btn" onClick={handleClearCart}>
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="cart-info">
              <div className="info-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H5V21H19V9Z"/>
                </svg>
                <div>
                  <h4>Secure Checkout</h4>
                  <p>Your payment information is encrypted and secure</p>
                </div>
              </div>

              <div className="info-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22 2 17.5 2 12 6.5 2 12 2M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M16.2 7.8L15 9L12 12L9 9L7.8 7.8L12 3.6L16.2 7.8Z"/>
                </svg>
                <div>
                  <h4>Fast Delivery</h4>
                  <p>Projects delivered within 7-14 business days</p>
                </div>
              </div>

              <div className="info-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
                </svg>
                <div>
                  <h4>Quality Assured</h4>
                  <p>All projects come with quality guarantee and support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;