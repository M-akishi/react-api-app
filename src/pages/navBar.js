import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const renderNavBarContent = () => {
    if (location.pathname === "/") {
      return (<nav className="navbar bg-dark navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <div className="navbar-brand">Restaurante</div>
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
                <Link to="/productos" className="nav-link" aria-current="page">
                  Stock productos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/platos" className="nav-link">
                  Platos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/mesas" className="nav-link">
                  Mesas
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/pedidos" className="nav-link">
                  pedidos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/boletas" className="nav-link">
                  Boletas
                </Link>
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

    if (location.pathname === "/productos") {
      return (<nav className="navbar bg-dark navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <div className="navbar-brand">Restaurante</div>
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
                <Link to="/platos" className="nav-link">
                  Platos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/mesas" className="nav-link">
                  Mesas
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/pedidos" className="nav-link">
                  pedidos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/boletas" className="nav-link">
                  Boletas
                </Link>
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

    if (location.pathname === "/platos") {
      return (<nav className="navbar bg-dark navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <div className="navbar-brand">Restaurante</div>
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
                <Link to="/productos" className="nav-link" aria-current="page">
                  Stock productos
                </Link>
              </li>
              <li className="nav-item active">
                <Link to="/platos" className="nav-link active">
                  Platos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/mesas" className="nav-link">
                  Mesas
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/pedidos" className="nav-link">
                  pedidos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/boletas" className="nav-link">
                  Boletas
                </Link>
              </li>
            </ul>
            <div className="ms-auto nav-item">
              <Link to="/platos/nuevo" className="nav-link text-light">
                Nuevo
              </Link>
            </div>
          </div>
        </div>
      </nav>
      );
    }

    if (location.pathname === "/mesas") {
      return (<nav className="navbar bg-dark navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <div className="navbar-brand">Restaurante</div>
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
                <Link to="/productos" className="nav-link" aria-current="page">
                  Stock productos
                </Link>
              </li>
              <li className="nav-item active">
                <Link to="/platos" className="nav-link">
                  Platos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/mesas" className="nav-link active">
                  Mesas
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/pedidos" className="nav-link">
                  pedidos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/boletas" className="nav-link">
                  Boletas
                </Link>
              </li>
            </ul>
            <div className="ms-auto nav-item">
              <Link to="/mesas/nuevo" className="nav-link text-light">
                Nuevo
              </Link>
            </div>
          </div>
        </div>
      </nav>
      );
    }

    if (location.pathname === "/pedidos" || /^\/pedidos\/\d+$/.test(location.pathname)) {
      return (<nav className="navbar bg-dark navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <div className="navbar-brand">Restaurante</div>
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
                <Link to="/productos" className="nav-link" aria-current="page">
                  Stock productos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/platos" className="nav-link">
                  Platos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/mesas" className="nav-link">
                  Mesas
                </Link>
              </li>
              <li className="nav-item active">
                <Link to="/pedidos" className="nav-link active">
                  pedidos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/boletas" className="nav-link">
                  Boletas
                </Link>
              </li>
            </ul>
            
          </div>
        </div>
      </nav>
      );
    }

    if (location.pathname === "/boletas") {
      return (<nav className="navbar bg-dark navbar-expand-lg border-bottom border-body" data-bs-theme="dark">
        <div className="container-fluid">
          <div className="navbar-brand">Restaurante</div>
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
                <Link to="/productos" className="nav-link" aria-current="page">
                  Stock productos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/platos" className="nav-link">
                  Platos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/mesas" className="nav-link">
                  Mesas
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/pedidos" className="nav-link">
                  pedidos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/boletas" className="nav-link active">
                  Boletas
                </Link>
              </li>
            </ul>
            <div className="ms-auto nav-item">
              <Link to="/boletas/nuevo" className="nav-link text-light">
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