import React, { useState } from 'react';
import './Login.css';
import axios from "axios";
import { toast } from 'react-toastify';

const Login = ({ url, setToken }) => {
  const [data, setData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${url}/api/admin/login`, data);

      if (response.data.success) {
        localStorage.setItem("admin-token", response.data.token);
        setToken(response.data.token);
        toast.success("Logged in successfully");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-form" onSubmit={onSubmitHandler}>
        <h2>Admin Login</h2>
        <div className="admin-login-field">
          <p>Email</p>
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="admin@example.com"
            required
          />
        </div>
        <div className="admin-login-field">
          <p>Password</p>
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
