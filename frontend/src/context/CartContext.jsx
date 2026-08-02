import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export { CartContext };

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true); // New state for auth checking
  const url = import.meta.env.VITE_API_URL;
  const [project_list, setProjectList] = useState([]);
  const [component_list, setComponentList] = useState([]);

  const fetchProjectList = async () => {
    try {
      const response = await axios.get(url + "/api/project/list");
      setProjectList(response.data.data);
    } catch (error) {
      console.error('Error fetching project list:', error);
    }
  };

  const fetchComponentList = async () => {
    try {
      const response = await axios.get(url + "/api/component/list");
      setComponentList(response.data.data);
    } catch (error) {
      console.error('Error fetching component list:', error);
    }
  };

  // Validate token with server
  const validateToken = async (tokenToValidate) => {
    if (!tokenToValidate) return false;
    
    try {
      console.log('🔍 Validating token with server...');
      const response = await axios.get(`${url}/api/user/verify`, {
        headers: {
          'token': tokenToValidate,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.data.success) {
        console.log('✅ Token is valid');
        return true;
      } else {
        console.log('❌ Token validation failed:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Token validation error:', error.response?.data || error.message);
      return false;
    }
  };

  // Initialize authentication on app load
  useEffect(() => {
    async function initializeAuth() {
      setIsAuthChecking(true);
      await fetchProjectList();
      await fetchComponentList();
      
      try {
        // Check for existing token
        const savedToken = localStorage.getItem('token') || localStorage.getItem('authToken');
        
        if (savedToken) {
          console.log('🔑 Found saved token, validating...');
          
          // Validate the token with server
          const isValid = await validateToken(savedToken);
          
          if (isValid) {
            setToken(savedToken);
            console.log('✅ Token validated, user remains logged in');
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('progify-cart');
            console.log('❌ Invalid token removed, user logged out');
          }
        } else {
          console.log('📭 No saved token found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsAuthChecking(false);
      }
    }
    
    initializeAuth();
  }, []);

  // Load cart when token changes (only after auth check is complete)
  useEffect(() => {
    if (isAuthChecking) return; // Don't load cart while checking auth
    
    if (token) {
      console.log('🔄 Token available, loading cart from server...');
      loadCartFromServer();
    } else {
      console.log('📱 No token, loading cart from localStorage...');
      loadCartFromLocalStorage();
    }
  }, [token, isAuthChecking]);

  // Save cart to localStorage whenever cartItems change (backup)
  useEffect(() => {
    if (isAuthChecking) return; // Don't save while checking auth
    
    try {
      localStorage.setItem('progify-cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems, isAuthChecking]);

  // Load cart from localStorage (fallback)
  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem('progify-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        console.log('📱 Loaded cart from localStorage:', parsedCart.length + ' items');
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCartItems([]);
    }
  };

  // Load cart from server
  const loadCartFromServer = async () => {
    if (!token) {
      console.log('❌ No token available for server request');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('🌐 Making API call to load cart from server...');
      const response = await axios.get(`${url}/api/cart`, {
        headers: {
          'token': token,
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Server response:', response.data);

      if (response.data.success) {
        setCartItems(response.data.cartItems || []);
        console.log('✅ Cart loaded from server:', response.data.cartItems?.length || 0, 'items');
      } else {
        console.error('❌ Failed to load cart from server:', response.data.message);
        // If cart load fails due to auth, logout user
        if (response.status === 401 || response.data.message?.includes('token')) {
          handleTokenExpired();
        } else {
          loadCartFromLocalStorage(); // Fallback to localStorage
        }
      }
    } catch (error) {
      console.error('❌ Error loading cart from server:', error.response?.data || error.message);
      
      // Check if it's an auth error
      if (error.response?.status === 401) {
        handleTokenExpired();
      } else {
        loadCartFromLocalStorage(); // Fallback to localStorage
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle token expiration
  const handleTokenExpired = () => {
    console.log('🚪 Token expired, logging out user');
    setToken('');
    setCartItems([]);
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('progify-cart');
    localStorage.removeItem('userData');
    // Optionally show a message to user about session expiration
  };

  // Login function - properly set token and persist it
  const login = (newToken, userData = null) => {
    console.log('🚪 Logging in user with new token');
    
    // Set token in state
    setToken(newToken);
    
    // Persist token and user data
    localStorage.setItem('token', newToken);
    localStorage.setItem('authToken', newToken);
    
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
    
    console.log('✅ User logged in successfully');
  };

  // Add item to cart - MAIN FUNCTION FOR API INTEGRATION
  const addToCart = async (item) => {
    console.log('🛒 Adding item to cart:', item);
    
    try {
      // Get current token
      const currentToken = token || localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (currentToken) {
        console.log('🔑 Token available, adding to server cart...');
        console.log('📤 API Request Details:', {
          url: `${url}/api/cart/add`,
          token: currentToken.substring(0, 10) + '...',
          itemId: item.id || item._id,
          itemName: item.name
        });
        
        // Make API call to add item to server cart
        const response = await axios.post(
          `${url}/api/cart/add`,
          { 
            itemId: item.id || item._id,
            projectData: item
          },
          { 
            headers: { 
              'token': currentToken,
              'Content-Type': 'application/json'
            } 
          }
        );

        console.log('📥 Server response:', response.data);

        if (response.data.success) {
          setCartItems(response.data.cartItems || []);
          console.log('✅ Item added to server cart successfully!');
          return { 
            success: true, 
            message: 'Item added to cart successfully!',
            source: 'server'
          };
        } else {
          console.error('❌ Server rejected add request:', response.data.message);
          throw new Error(response.data.message || 'Failed to add item to server cart');
        }
      } else {
        console.log('⚠️ No token found, adding to local cart only...');
        
        // Add to local cart when no token
        const updatedItems = (() => {
          const existingItem = cartItems.find(cartItem => 
            (cartItem.id || cartItem._id) === (item.id || item._id)
          );
          
          if (existingItem) {
            console.log('📝 Updating existing item quantity');
            return cartItems.map(cartItem =>
              (cartItem.id || cartItem._id) === (item.id || item._id)
                ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
                : cartItem
            );
          } else {
            console.log('➕ Adding new item to cart');
            return [...cartItems, { ...item, quantity: 1 }];
          }
        })();

        setCartItems(updatedItems);
        console.log('✅ Item added to local cart');
        
        return { 
          success: true, 
          message: 'Item added to local cart (login to sync with server)',
          source: 'local'
        };
      }
    } catch (error) {
      console.error('❌ Error in addToCart:', error.response?.data || error.message);
      
      // Check if it's an auth error
      if (error.response?.status === 401) {
        handleTokenExpired();
        return { 
          success: false, 
          message: 'Session expired. Please login again.',
          source: 'auth_error'
        };
      }
      
      // Fallback to local cart on any error
      const updatedItems = (() => {
        const existingItem = cartItems.find(cartItem => 
          (cartItem.id || cartItem._id) === (item.id || item._id)
        );
        
        if (existingItem) {
          return cartItems.map(cartItem =>
            (cartItem.id || cartItem._id) === (item.id || item._id)
              ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
              : cartItem
          );
        } else {
          return [...cartItems, { ...item, quantity: 1 }];
        }
      })();

      setCartItems(updatedItems);
      console.log('⚠️ Fallback: Item added to local cart due to server error');
      
      return { 
        success: false, 
        message: 'Added to local cart (server error - will sync when connection restored)',
        source: 'local_fallback'
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const currentToken = token || localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (currentToken) {
        console.log('🗑️ Removing item from server cart...', itemId);
        
        const response = await axios.post(
          `${url}/api/cart/remove`,
          { itemId: itemId },
          { 
            headers: { 
              token: currentToken,
              'Content-Type': 'application/json'
            } 
          }
        );

        if (response.data.success) {
          setCartItems(response.data.cartItems || []);
          console.log('✅ Item removed from server cart successfully');
        } else {
          throw new Error(response.data.message);
        }
      } else {
        // Local removal
        const updatedItems = cartItems.filter(item => (item.id || item._id) !== itemId);
        setCartItems(updatedItems);
        console.log('✅ Item removed from local cart');
      }
    } catch (error) {
      console.error('❌ Error removing item:', error);
      
      // Check if it's an auth error
      if (error.response?.status === 401) {
        handleTokenExpired();
      }
      
      // Fallback to local removal
      const updatedItems = cartItems.filter(item => (item.id || item._id) !== itemId);
      setCartItems(updatedItems);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    try {
      const currentToken = token || localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (currentToken) {
        console.log('📝 Updating quantity on server...', { itemId, newQuantity });
        
        const response = await axios.post(
          `${url}/api/cart/update-quantity`,
          { itemId, quantity: newQuantity },
          { 
            headers: { 
              token: currentToken,
              'Content-Type': 'application/json'
            } 
          }
        );

        if (response.data.success) {
          setCartItems(response.data.cartItems || []);
          console.log('✅ Quantity updated on server');
        } else {
          throw new Error(response.data.message);
        }
      } else {
        // Local update
        const updatedItems = cartItems.map(item =>
          (item.id || item._id) === itemId
            ? { ...item, quantity: newQuantity }
            : item
        );
        setCartItems(updatedItems);
        console.log('✅ Quantity updated locally');
      }
    } catch (error) {
      console.error('❌ Error updating quantity:', error);
      
      // Check if it's an auth error
      if (error.response?.status === 401) {
        handleTokenExpired();
      }
      
      // Fallback to local update
      const updatedItems = cartItems.map(item =>
        (item.id || item._id) === itemId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCartItems(updatedItems);
    }
  };

  const clearCart = async () => {
    try {
      const currentToken = token || localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (currentToken) {
        const response = await axios.delete(
          `${url}/api/cart/clear`,
          { 
            headers: { 
              token: currentToken,
              'Content-Type': 'application/json'
            } 
          }
        );

        if (response.data.success) {
          setCartItems([]);
          console.log('✅ Cart cleared on server');
        } else {
          throw new Error(response.data.message);
        }
      } else {
        setCartItems([]);
        console.log('✅ Local cart cleared');
      }
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      
      // Check if it's an auth error
      if (error.response?.status === 401) {
        handleTokenExpired();
      }
      
      setCartItems([]);
    }
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const isInCart = (itemId) => {
    return cartItems.some(item => (item.id || item._id) === itemId);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const logout = () => {
    console.log('👋 Logging out user...');
    setToken('');
    setCartItems([]);
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('progify-cart');
    localStorage.removeItem('userData');
    console.log('👋 User logged out, all data cleared');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !isAuthChecking;
  };

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  // Refresh auth status (useful for components that need to check auth)
  const refreshAuthStatus = async () => {
    const currentToken = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (currentToken && currentToken !== token) {
      console.log('🔄 Refreshing auth status with token validation...');
      const isValid = await validateToken(currentToken);
      if (isValid) {
        setToken(currentToken);
      } else {
        handleTokenExpired();
      }
    }
  };

  // Debug function to check current state
  const debugCartState = () => {
    console.log('🐛 Cart Debug Info:', {
      token: token ? token.substring(0, 10) + '...' : 'No token',
      cartItemsCount: cartItems.length,
      cartItems: cartItems,
      isLoading,
      isAuthChecking,
      isAuthenticated: isAuthenticated()
    });
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemsCount,
    getCartTotal,
    isInCart,
    handleCartClick,
    isCartOpen,
    setIsCartOpen,
    closeCart,
    url,
    token,
    setToken,
    login, // New login function
    logout,
    isLoading,
    isAuthChecking, // New state
    loadCartFromServer,
    project_list,
    component_list,
    refreshAuthStatus,
    isAuthenticated, // New helper
    getUserData, // New helper
    debugCartState
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};