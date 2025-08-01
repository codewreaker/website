import './footer-new.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <p>&copy; {currentYear} Israel Prempeh. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;