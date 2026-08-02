import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart, token, url } = useCart();
  
  const [orderForm, setOrderForm] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Shipping Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    
    // Payment Information
    paymentMethod: 'razorpay',
    
    // Order Notes
    orderNotes: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculate totals (same logic as Cart component)
  const subtotal = getCartTotal();
  const processingFee = 500;
  const taxRate = 0.18;
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + processingFee + taxAmount;

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!orderForm.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!orderForm.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!orderForm.email.trim()) newErrors.email = 'Email is required';
    if (!orderForm.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!orderForm.address.trim()) newErrors.address = 'Address is required';
    if (!orderForm.city.trim()) newErrors.city = 'City is required';
    if (!orderForm.state.trim()) newErrors.state = 'State is required';
    if (!orderForm.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (orderForm.email && !emailRegex.test(orderForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (orderForm.phone && !phoneRegex.test(orderForm.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!token) {
      alert('Please log in to place an order.');
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      const items = cartItems.map(item => ({
        id: item.id || item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity || 1
      }));

      const address = {
        firstName: orderForm.firstName,
        lastName: orderForm.lastName,
        email: orderForm.email,
        phone: orderForm.phone,
        address: orderForm.address,
        city: orderForm.city,
        state: orderForm.state,
        zipCode: orderForm.zipCode,
        country: orderForm.country
      };

      if (orderForm.paymentMethod === 'cod') {
        // Cash on delivery - save the order directly, no payment gateway needed
        const response = await axios.post(`${url}/api/order/place`, {
          items,
          amount: grandTotal,
          address,
          payment: false
        }, { headers: { token } });

        if (response.data.success) {
          clearCart();
          alert('Order placed successfully! You will receive a confirmation email shortly.');
          navigate('/');
        } else {
          alert(response.data.message || 'There was an error placing your order. Please try again.');
        }
        setIsProcessing(false);
      } else {
        // Online payment via Razorpay
        await handleRazorpayPayment(items, address);
      }

    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error placing your order. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async (items, address) => {
    if (!window.Razorpay) {
      alert('Payment gateway failed to load. Please check your internet connection and try again.');
      setIsProcessing(false);
      return;
    }

    try {
      // Step 1: ask our backend to create a Razorpay order for this amount
      const { data: createData } = await axios.post(
        `${url}/api/order/razorpay/create`,
        { amount: grandTotal },
        { headers: { token } }
      );

      if (!createData.success) {
        alert(createData.message || 'Could not initiate payment. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Step 2: open Razorpay's hosted checkout widget
      const options = {
        key: createData.key,
        amount: createData.amount,
        currency: createData.currency,
        name: 'Projify',
        description: 'Project Purchase',
        order_id: createData.razorpayOrderId,
        prefill: {
          name: `${orderForm.firstName} ${orderForm.lastName}`,
          email: orderForm.email,
          contact: orderForm.phone
        },
        theme: { color: '#27ae60' },
        handler: async function (response) {
          // Step 3: Razorpay confirms payment succeeded on their end.
          // We now ask OUR backend to verify the signature and save the order.
          try {
            const verifyRes = await axios.post(
              `${url}/api/order/razorpay/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items,
                amount: grandTotal,
                address
              },
              { headers: { token } }
            );

            if (verifyRes.data.success) {
              clearCart();
              alert('Payment successful! Your order has been placed.');
              navigate('/');
            } else {
              alert(verifyRes.data.message || 'Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Error verifying payment:', err);
            alert('Payment was received but verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          // User closed the checkout widget without paying
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const razorpayCheckout = new window.Razorpay(options);
      razorpayCheckout.on('payment.failed', function (response) {
        alert('Payment failed: ' + response.error.description);
        setIsProcessing(false);
      });
      razorpayCheckout.open();

    } catch (error) {
      console.error('Error starting Razorpay payment:', error);
      alert('There was an error starting the payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="place-order-page">
        <div className="empty-order">
          <h2>No items to order</h2>
          <p>Your cart is empty. Please add some items before placing an order.</p>
          <button className="back-to-shop-btn" onClick={() => navigate('/')}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="place-order-page">
      <div className="order-container">
        <div className="order-header">
          <button className="back-btn" onClick={handleBackToCart}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"/>
            </svg>
            Back to Cart
          </button>
          <h1>Place Your Order</h1>
        </div>

        <div className="order-content">
          <div className="order-form-section">
            <form onSubmit={handleSubmitOrder} className="order-form">
              {/* Personal Information */}
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={orderForm.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={orderForm.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={orderForm.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={orderForm.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="form-section">
                <h3>Shipping Address</h3>
                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={orderForm.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={orderForm.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={orderForm.state}
                      onChange={handleInputChange}
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={orderForm.zipCode}
                      onChange={handleInputChange}
                      className={errors.zipCode ? 'error' : ''}
                    />
                    {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <select
                      id="country"
                      name="country"
                      value={orderForm.country}
                      onChange={handleInputChange}
                    >
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={orderForm.paymentMethod === 'razorpay'}
                      onChange={handleInputChange}
                    />
                    <span>Pay Online (Card / UPI / Netbanking / Wallet)</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={orderForm.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>

                {orderForm.paymentMethod === 'razorpay' && (
                  <p className="payment-gateway-note">
                    🔒 You'll be redirected to Razorpay's secure checkout to complete your payment.
                  </p>
                )}
              </div>

              {/* Order Notes */}
              <div className="form-section">
                <h3>Order Notes (Optional)</h3>
                <div className="form-group">
                  <label htmlFor="orderNotes">Special Instructions</label>
                  <textarea
                    id="orderNotes"
                    name="orderNotes"
                    value={orderForm.orderNotes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any special instructions for your order..."
                  ></textarea>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="order-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">Qty: {item.quantity || 1}</span>
                    </div>
                    <span className="item-price">
                      {formatPrice(item.price * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-calculations">
                <div className="summary-row">
                  <span>Subtotal</span>
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
              </div>

              <button 
                type="submit" 
                form="orderForm"
                className="place-order-btn"
                disabled={isProcessing}
                onClick={handleSubmitOrder}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : orderForm.paymentMethod === 'razorpay' ? (
                  `Pay ${formatPrice(grandTotal)}`
                ) : (
                  `Place Order - ${formatPrice(grandTotal)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;