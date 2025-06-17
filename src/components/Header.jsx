import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

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
          <NavLink
            to="/dashboard"
            className="pagename"
            activeClassName="current"
          >
            Dashboard
          </NavLink>
          <NavLink to="/new-form" activeClassName="current">
            New form
          </NavLink>
          <NavLink to="/account" activeClassName="current">
            Account
          </NavLink>
          <button onClick={handleLogout} className="btn-link nav-btn">
            Logout
          </button>
        </div>
      </nav>
      <button className="btn-close btn btn-sm">&times;</button>
    </>
  );
}

export default Header;
