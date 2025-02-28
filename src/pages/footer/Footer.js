import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <img src={'/resources/polidriving_logo.png'} alt="POLIDriving" className="footer-image" />
      <p className="footer-text">Escuela Politécnica Nacional</p>
      <p className="footer-text">Departamento de Informática y Ciencias de la Computación (DICC)</p>
      <p className="footer-text">Ladrón de Guevara E11-253</p>
      <p className="footer-text">Quito, Ecuador</p>
      <p>
        <a href="mailto:polidriving@gmail.com" className="footer-link">
          polidriving@gmail.com
        </a>
      </p>
      <p className="footer-copy">&copy; 2024 POLIDriving</p>
    </footer>
  );
};

export default Footer;