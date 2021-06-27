import React, { useEffect, Suspense } from "react";
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
  putAppUsername,
  delAppUsername,
} from "./services/storage";
import { apiGetUser, setAuthHeader, apiLogout } from "./services/api";
import { getAxiosError } from "./services/utils";

// context
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

// all components
import Loading from "./components/Loading";
import Index from "./components/Index";
import Auth from "./components/Auth";
import ViewForm from "./components/ViewForm";
import NotFound from "./components/NotFound";
import AlertMessages from "./components/AlertMessages";
const Dashboard = React.lazy(() => import("./components/Dashboard"));
const NewForm = React.lazy(() => import("./components/NewForm"));
const ViewFormResponses = React.lazy(() =>
  import("./components/ViewFormResponses")
);

function App() {
  const appState = {
    // the person who can create forms and can view dashboard
    formAuthor: {
      token: getAuthorToken(),
      user: "", // will be got back from our api
    },
    // normal users, who answer forms
    formUser: {
      name: getAppUsername(),
    },
    // only for form authors
    isLoggedIn: Boolean(getAuthorToken()),
    // for actions that users do in the app like submitting forms, logins etc.
    alertMessages: [],
    scrollToTop: false,
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
      case "formAuthor":
        draft.formAuthor.user = action.value;
        return;
      case "formUser":
        draft.formUser.name = action.value;
        return;
      case "alertMessage":
        draft.alertMessages.push({
          type: action.message_type,
          message: action.value,
          heading: action.heading || null,
        });
        draft.scrollToTop = true;
        return;
      case "alertMessageClear":
        if (action.value === -1) {
          // remove first message in list if -1 is passed
          draft.alertMessages.shift();
        } else {
          // remove specific message
          draft.alertMessages.splice(action.value, 1);
        }
        draft.scrollToTop = false;
        return;
      default:
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(appReducer, appState);

  // clear alert messages one by one after 3 second delay
  useEffect(() => {
    if (state.alertMessages.length) {
      const delay = setTimeout(() => {
        dispatch({ type: "alertMessageClear", value: -1 });
      }, 3000);

      return () => clearTimeout(delay);
    }
  }, [state.alertMessages, dispatch]);

  // scroll to top of page after messages are set
  useEffect(() => {
    if (state.scrollToTop) {
      window.scrollTo(0, 0);
    }
  }, [state.scrollToTop]);

  useEffect(() => {
    const request = axios.CancelToken.source();
    async function getUser() {
      try {
        const response = await apiGetUser({ req_cancel_token: request.token });
        //console.log(response.data);
        dispatch({ type: "formAuthor", value: response.data.user });
      } catch (e) {
        dispatch({
          type: "alertMessage",
          value: getAxiosError(e),
          message_type: "danger",
          heading: "Request error",
        });
        // TODO: there's a chance that the token has expired and the server returned a 403
        // In that case logout. Is there a better way to handle this?
        dispatch({
          type: "logout",
        });
      }
    }

    async function doLogout() {
      try {
        await apiLogout();
        dispatch({
          type: "alertMessage",
          value: "You've successfully logged out",
          message_type: "success",
          heading: "Bye!",
        });
      } catch (e) {
        // TODO: what to do here?
        console.log("Exception in logout");
      }
    }

    if (state.isLoggedIn && state.formAuthor.token) {
      setAuthHeader({ token: state.formAuthor.token });
      putAuthorToken(state.formAuthor.token);
      getUser();

      return () => request.cancel();
    } else {
      if (state.formAuthor.token) {
        doLogout();
      }
      delAuthorToken();
    }
  }, [state.isLoggedIn, state.formAuthor.token, dispatch]);

  useEffect(() => {
    if (state.formUser.name) {
      putAppUsername(state.formUser.name);
    } else {
      delAppUsername();
    }
  }, [state.formUser.name]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <AlertMessages messages={state.alertMessages} />
          <Suspense fallback={<Loading />}>
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
              <Route path="/" exact component={Index} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
