// client/src/components/NavBar.jsx
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaBriefcase,
  FaUsers,
  FaPlusCircle,
  FaSignOutAlt,
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes
} from 'react-icons/fa';

// Simple JWT parser to extract the payload
function parseJwt(token) {
  try {
    const base64 = token.split('.')[1];
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const payload = token ? parseJwt(token) : null;
  const role = payload?.role;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    {
      to: "/",
      icon: <FaHome />,
      text: "Home",
      show: true
    },
    {
      to: "/jobs",
      icon: <FaBriefcase />,
      text: "Jobs",
      show: role === 'jobseeker'
    },
    {
      to: "/post-job",
      icon: <FaPlusCircle />,
      text: "Post Job",
      show: role === 'employer'
    },
    {
      to: "/employees",
      icon: <FaUsers />,
      text: "Employees",
      show: role === 'employer'
    },
    {
      to: "/dashboard",
      icon: <FaUserCircle />,
      text: "Dashboard",
      show: role === 'jobseeker' || role === 'employer'
    }
  ];

  return (
    <nav className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            JobJungle
          </Link>

          {/* Hamburger menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link, index) => (
              link.show && (
                <NavLink
                  key={index}
                  to={link.to}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  {link.icon} <span>{link.text}</span>
                </NavLink>
              )
            ))}

            {/* Login/Register or Logout */}
            {token ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-800"
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  <FaSignInAlt /> <span>Login</span>
                </NavLink>
                <NavLink
                  to="/register"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  <FaUserPlus /> <span>Register</span>
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-b-lg">
            {navLinks.map((link, index) => (
              link.show && (
                <NavLink
                  key={index}
                  to={link.to}
                  onClick={closeMenu}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                >
                  {link.icon} <span>{link.text}</span>
                </NavLink>
              )
            ))}

            {/* Mobile Login/Register or Logout */}
            {token ? (
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-red-600 hover:text-red-800 hover:bg-gray-100"
              >
                <FaSignOutAlt /> <span>Logout</span>
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                >
                  <FaSignInAlt /> <span>Login</span>
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={closeMenu}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                >
                  <FaUserPlus /> <span>Register</span>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
