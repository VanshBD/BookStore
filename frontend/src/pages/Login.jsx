import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate("/"); // Redirect to homepage after login
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center items-center">
      <div className="bg-white/20 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Login</h2>
        <p className="text-center text-gray-300 mb-4">
          Welcome back! Please login to your account.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded-md text-black"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-md w-full"
          >
            Log in
          </button>
        </form>
        <p className="text-center text-gray-300 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-rose-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
