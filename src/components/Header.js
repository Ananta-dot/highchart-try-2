import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css'; // We will create this CSS file next

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <NavLink to="/" className="logo">
          StockXYZ
        </NavLink>
        <nav>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
