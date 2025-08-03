import React from 'react';
import './footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="terminal-footer gradient-bg">
        <div className="footer-content">
          <p className="terminal-prompt">israel@london:~$</p>
          <p className="terminal-text">
            echo "Made with ❤️ by Israel" © {currentYear}
          </p>
        </div>
    </footer>
  );
};

export default Footer;
