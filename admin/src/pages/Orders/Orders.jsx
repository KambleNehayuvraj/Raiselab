import React, { useEffect, useState } from 'react'
import './Orders.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { handleAuthError } from '../../utils/authHandler'

const STATUS_OPTIONS = [
  "Project Under Development",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled"
];

const Orders = ({ url, token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.data);
      } else if (!handleAuthError(response.data.message)) {
        toast.error(response.data.message || "Failed to load orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value
      }, { headers: { token } });

      if (response.data.success) {
        await fetchAllOrders();
      } else if (!handleAuthError(response.data.message)) {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='orders-page'>
      <p className='orders-title'>All Orders</p>

      {loading ? (
        <p className='orders-empty'>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className='orders-empty'>No orders yet.</p>
      ) : (
        <div className='orders-list'>
          {orders.map((order) => (
            <div key={order._id} className='order-card'>
              <div className='order-card-header'>
                <span className='order-id'>Order #{order._id.slice(-8).toUpperCase()}</span>
                <span className='order-date'>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>

              <div className='order-items'>
                {order.items.map((item, idx) => (
                  <div key={idx} className='order-item-row'>
                    <span>{item.name} × {item.quantity || 1}</span>
                    <span>₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className='order-address'>
                <p><strong>{order.address.firstName} {order.address.lastName}</strong></p>
                <p>{order.address.address}, {order.address.city}, {order.address.state} - {order.address.zipCode}</p>
                <p>{order.address.phone} · {order.address.email}</p>
              </div>

              <div className='order-footer'>
                <div className='order-amount'>
                  <span>Total</span>
                  <strong>₹{order.amount.toLocaleString('en-IN')}</strong>
                </div>
                <div className='order-payment'>
                  {order.payment ? (
                    <span className='payment-badge paid'>Paid</span>
                  ) : (
                    <span className='payment-badge unpaid'>Cash on Delivery</span>
                  )}
                </div>
                <select
                  className='order-status-select'
                  value={order.status}
                  onChange={(e) => statusHandler(e, order._id)}
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
