import React from 'react';
import { Link } from "react-router-dom";
import './NavBar.css';

const NavBar = () => {
  return (
    <div className="nav-bar-container">
      <div className="nav-bar-logo">Residential Community Hub</div>
      <div className="nav-bar-links">
        <Link to="/" className="nav-bar-link">Dashboard</Link>
        <Link to="/sign-in" className="nav-bar-link">SignIn</Link>
        <Link to="/sign-up" className="nav-bar-link">SignUp</Link>
        <Link to="/about" className="nav-bar-link">AboutUs</Link>
        <Link to="/contact" className="nav-bar-link">ContactUs</Link>
      </div>
    </div>
  );
}

export default NavBar;
