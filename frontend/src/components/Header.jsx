// src/components/Header.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaPlus,
  FaBook,
  FaBookReader,
} from "react-icons/fa";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="backdrop-blur-lg bg-black text-gray-800 p-4 flex justify-between items-center shadow-lg ">
      {/* Logo */}
      <div>
        <Link to="/" className="text-2xl font-bold text-blue-500">
          Book Store
        </Link>
      </div>

      {/* Navigation items */}
      <div className="flex items-center space-x-8 mx-auto">
        {user && (
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-blue-500 text-white flex items-center">
                <FaBook className="inline mr-1" aria-hidden="true" /> All Books
              </Link>
            </li>
            <li>
              <Link
                to="/add-book"
                className="hover:text-blue-500 text-white flex items-center"
              >
                <FaPlus className="inline mr-1" aria-hidden="true" /> Add Book
              </Link>
            </li>
            <li>
              <Link
                to="/my-books"
                className="hover:text-blue-500 text-white flex items-center"
              >
                <FaBook className="inline mr-1" aria-hidden="true" />My
                Books
              </Link>
            </li>
            <li>
              <Link
                to="/my-borrowed-books"
                className="hover:text-blue-500 text-white flex items-center"
              >
                <FaBookReader className="inline mr-1" aria-hidden="true" /> Borrowed Books </Link>
            </li>
          </ul>
        )}
      </div>

      {/* User and Logout */}
      <div className="flex items-center space-x-4">
        {!user ? (
          <div className="flex space-x-4">
            <Link to="/login" className="hover:text-blue-500 text-white flex items-center">
              <FaSignInAlt className="inline mr-1" aria-hidden="true" /> Login
            </Link>
            <Link to="/register" className="hover:text-blue-500 text-white flex items-center">
              <FaUserPlus className="inline mr-1" aria-hidden="true" /> Register
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-blue-300">{user.username}</span>
            <button
              onClick={logout}
              className="hover:text-blue-500 flex text-white items-center"
            >
              <FaSignOutAlt className="inline mr-1" aria-hidden="true" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
