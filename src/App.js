import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useImmerReducer } from "use-immer";

import PrivateRoute from "./PrivateRoute";

// services
import { getAppUsername, getAuthorToken } from "./services/storage";

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
