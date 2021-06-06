// https://ui.dev/react-router-v5-protected-routes-authentication/
// make sure to redirect the user back to the page they originally
// wanted to visit when auth failed

import { Route, Redirect } from "react-router-dom";
import { useContext } from "react";

import StateContext from "./StateContext";

function PrivateRoute({ component: Component, ...rest }) {
  const appState = useContext(StateContext);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return appState.isLoggedIn ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: "/auth",
              state: { from: location },
            }}
          />
        );
      }}
    ></Route>
  );
}

export default PrivateRoute;
