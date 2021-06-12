import { useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import axios from "axios";

import PrivateRoute from "./PrivateRoute";

// services
import {
  getAppUsername,
  getAuthorToken,
  putAuthorToken,
  delAuthorToken,
} from "./services/storage";
import { apiGetUser, apiLogout, setAuthHeader } from "./services/api";

// context
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

// all components
import Auth from "./components/Auth";
import ViewForm from "./components/ViewForm";
import Dashboard from "./components/Dashboard";
import NewForm from "./components/NewForm";
import ViewFormResponses from "./components/ViewFormResponses";
import NotFound from "./components/NotFound";

function App() {
  const appState = {
    // the person who can create forms and can view dashboard
    formAuthor: {
      token: getAuthorToken(),
    },
    // normal users, who answer forms
    formUser: {
      name: getAppUsername(),
    },
    // only for form authors
    isLoggedIn: Boolean(getAuthorToken()),
    // for actions that users do in the app like submitting forms, logins etc.
    flashMessages: [],
  };

  const appReducer = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.formAuthor = action.data;
        draft.isLoggedIn = true;
        return;
      default:
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(appReducer, appState);

  useEffect(() => {
    if (state.isLoggedIn && state.formAuthor.token) {
      setAuthHeader({ token: state.formAuthor.token });
      putAuthorToken(state.formAuthor.token);
    } else {
      delAuthorToken();
      apiLogout();
    }
  }, [state.formAuthor.token, state.isLoggedIn]);

  // on first render check token validity, if token present
  useEffect(() => {
    const request = axios.CancelToken.source();
    async function getUser() {
      try {
        const response = await apiGetUser({ req_cancel_token: request.token });
        console.log(response.data);
      } catch (e) {
        // TODO: show alert message
        console.log(e);
        console.log("Exception in sending user info fetch request");
      }
    }

    if (state.isLoggedIn && state.formAuthor.token) {
      getUser();
    }
    return () => request.cancel();
    // eslint-disable-next-line
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Switch>
            <Route path="/auth" exact component={Auth} />
            <PrivateRoute path="/dashboard" exact component={Dashboard} />
            <PrivateRoute path="/new-form" exact component={NewForm} />
            <PrivateRoute
              path="/:form_uri/responses"
              exact
              component={ViewFormResponses}
            />
            <Route path="/:form_uri" exact component={ViewForm} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
