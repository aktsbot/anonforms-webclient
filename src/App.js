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
import AlertMessages from "./components/AlertMessages";

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
    alertMessages: [
      {
        heading: "Info",
        message: "This is just an info message",
      },
      {
        type: "danger",
        heading: "Error",
        message: "Oh no! It failed",
      },
      {
        type: "success",
        heading: "Success",
        message: "Hurray! It worked.",
      },
    ],
  };

  const appReducer = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.formAuthor = action.data;
        draft.isLoggedIn = true;
        return;
      case "logout":
        draft.isLoggedIn = false;
        return;
      case "alertMessage":
        draft.alertMessages.push({
          type: action.type,
          messsage: action.value,
          heading: action.heading || null,
        });
        return;
      case "alertMessageClear":
        if (action.value === -1) {
          // remove first message in list if -1 is passed
          draft.alertMessages.shift();
        } else {
          // remove specific message
          draft.alertMessages.splice(action.value, 1);
        }
        return;
      default:
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(appReducer, appState);

  // clear alert messages one by one after 2 second delay
  useEffect(() => {
    if (state.alertMessages.length) {
      const delay = setTimeout(() => {
        dispatch({ type: "alertMessageClear", value: -1 });
      }, 2000);

      return () => clearTimeout(delay);
    }
  }, [state.alertMessages, dispatch]);

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
          <AlertMessages messages={state.alertMessages} />
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
