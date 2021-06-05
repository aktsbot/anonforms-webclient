import React from "react";
import { Link } from "react-router-dom";

function Header(props) {
  function handleLogout() {
    return;
  }

  return (
    <>
      <nav className="nav" tabIndex="-1">
        <div className="container">
          <Link to="/" className="pagename">
            Dashboard
          </Link>
          <Link to="/new-form" className="current">
            New form
          </Link>
          <Link to="/account">Account</Link>
          <button onClick={handleLogout} href="#" className="nav-btn">
            Logout
          </button>
        </div>
      </nav>
      <button className="btn-close btn btn-sm">×</button>
    </>
  );
}

export default Header;
