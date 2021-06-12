import React, { useContext } from "react";
import { Link } from "react-router-dom";

import DispatchContext from "../DispatchContext";

function Header(props) {
  const appDispatch = useContext(DispatchContext);

  function handleLogout() {
    appDispatch({ type: "logout" });
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
      <button className="btn-close btn btn-sm">&times;</button>
    </>
  );
}

export default Header;
