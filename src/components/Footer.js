import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <p>&copy; {currentYear} StcokXYZ. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
