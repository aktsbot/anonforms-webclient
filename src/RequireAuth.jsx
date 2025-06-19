// https://ui.dev/react-router-v5-protected-routes-authentication/
// make sure to redirect the user back to the page they originally
// wanted to visit when auth failed

import { Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import StateContext from "./StateContext";

function RequireAuth({ children }) {
  const appState = useContext(StateContext);

  return appState.isLoggedIn ? (
    children
  ) : (
    <Navigate
      to={{
        pathname: "/auth",
        state: { from: location },
      }}
    />
  );
}

export default RequireAuth;
