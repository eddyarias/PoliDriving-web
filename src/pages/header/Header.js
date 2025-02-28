import React from "react";
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <img src={'/resources/Start_1.png'} alt="POLIDriving Logo" className="header-logo" />
      <div className="header-text">
        <h1 className="header-title">
          POLIDriving WebApp
        </h1>
        <p className="header-subtitle">Calcula el nivel de riesgo al conducir</p>
      </div>
    </header>
  );
};

export default Header;