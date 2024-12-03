import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const renderNavBarContent = () => {
    if (location.pathname === "/") {
      return <nav className="navbar bg-dark navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand">Restaurante</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/productos">Stock productos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Pricing</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-disabled="true">Disabled</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    }

    if (location.pathname === "/productos") {
      return (<nav className="navbar bg-dark navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
          <div className="container-fluid">
            <a className="navbar-brand">Restaurante</a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/productos" className="nav-link active" aria-current="page">
                    Stock productos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/features" className="nav-link">
                    Features
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/pricing" className="nav-link">
                    Pricing
                  </Link>
                </li>
                <li className="nav-item">
                  <span className="nav-link" aria-disabled="true">
                    Disabled
                  </span>
                </li>
              </ul>
              <div className="ms-auto nav-item">
                <Link to="/productos/nuevo" className="nav-link text-light">
                  Nuevo
                </Link>
              </div>
            </div>
          </div>
        </nav>
      );
    }
  }

  
  
  return <>{renderNavBarContent()}</>;

}

export default NavBar;