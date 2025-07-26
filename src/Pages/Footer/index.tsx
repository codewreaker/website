import React from 'react';
import './footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
      <footer className="terminal-footer gradient-bg">
        <div className="footer-content">
          <span className="terminal-prompt">israel@adenta:~$</span>
          <span className="terminal-text">
            echo "Made with ❤️ by Israel" © {currentYear}
          </span>
        </div>
      </footer>
  );
};

export default Footer;
