import React, { useContext, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import axios from "axios";

import Page from "./Page";
import DispatchContext from "../DispatchContext";
import { apiAuth, apiSession } from "../services/api";

function Auth() {
  const appDispatch = useContext(DispatchContext);

  const initialState = {
    email: {
      value: "",
      hasErrors: false,
      submitCount: 0,
    },
    authCode: {
      value: "",
      hasErrors: false,
      submitCount: 0,
    },
    message: "",
    isBtnDisabled: false,
    isEmailDisabled: false,
    btnText: "Send secret code",
    isEmailSent: false,
  };

  const authReducer = (draft, action) => {
    switch (action.type) {
      case "emailChange":
        draft.email.value = action.value;
        draft.email.hasErrors = false;
        return;
      case "submitEmail":
        draft.email.hasErrors = false;
        draft.email.submitCount = draft.email.submitCount + 1;
        draft.isEmailDisabled = true;
        draft.isBtnDisabled = true;
        draft.btnText = "Please wait ...";
        return;
      case "emailSent":
        draft.isEmailSent = true;
        draft.btnText = "Continue";
        draft.isBtnDisabled = false;
        return;
      case "authCodeChange":
        draft.authCode.value = action.value;
        draft.authCode.hasErrors = false;
        return;
      case "submitAuthCode":
        draft.authCode.hasErrors = false;
        draft.authCode.submitCount = draft.email.submitCount + 1;
        draft.isBtnDisabled = true;
        draft.btnText = "Please wait ...";
        return;
      default:
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(authReducer, initialState);

  useEffect(() => {
    const request = axios.CancelToken.source();
    async function sendAuth() {
      try {
        await apiAuth({
          email: state.email.value,
          req_cancel_token: request.token,
        });
        dispatch({ type: "emailSent" });
      } catch (e) {
        // TODO: show alert message
        console.log(e);
        console.log("Exception in sending auth request");
      }
    }

    if (state.email.submitCount && state.email.value) {
      sendAuth();
    }
    return () => request.cancel();
  }, [state.email.submitCount, state.email.value, dispatch]);

  useEffect(() => {
    const request = axios.CancelToken.source();
    async function getSession() {
      try {
        const response = await apiSession({
          email: state.email.value,
          auth_code: state.authCode.value,
          req_cancel_token: request.token,
        });
        appDispatch({ type: "login", data: response.data });
      } catch (e) {
        // TODO: show alert message
        console.log(e);
        console.log("Exception in sending session request");
      }
    }

    if (
      state.authCode.submitCount &&
      state.email.value &&
      state.authCode.value
    ) {
      getSession();
    }
    return () => request.cancel();
  }, [
    state.authCode.submitCount,
    state.email.value,
    state.authCode.value,
    dispatch,
    appDispatch,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!state.isEmailSent) {
      // call api to send an auth code to the user's email address
      dispatch({ type: "submitEmail" });
    } else {
      // call api to check if email + auth code is valid
      dispatch({ type: "submitAuthCode" });
    }
    return;
  };

  return (
    <Page title="Authentication">
      <h2>Enter your email to authenticate</h2>
      <div className="row">
        <form onSubmit={handleSubmit}>
          <label htmlFor="auth-email">Email ID</label>
          <input
            type="email"
            placeholder="alice@example.com"
            required
            id="auth-email"
            className="smooth w-100"
            autoComplete="off"
            name="email"
            disabled={state.isEmailDisabled}
            onChange={(e) =>
              dispatch({ type: "emailChange", value: e.target.value })
            }
          />
          {state.isEmailSent && (
            <>
              <label htmlFor="auth-code">Your secret code sent via email</label>
              <input
                type="text"
                placeholder="AC-abcde12345"
                required
                id="auth-code"
                className="smooth w-100"
                autoComplete="off"
                name="auth-code"
                onChange={(e) =>
                  dispatch({ type: "authCodeChange", value: e.target.value })
                }
              />
            </>
          )}
          <button
            type="submit"
            className="btn btn-sm btn-b"
            disabled={state.isBtnDisabled}
          >
            {state.btnText}
          </button>
        </form>
      </div>

      <div>
        <div className="msg">
          <h3>Please note</h3>
          <ul>
            <li>
              On submitting your email id, you'd receive an email with a code
              that you'd have to copy and paste in the corresponding filed.
            </li>
            <li>
              After submission of email + code, the app would load up a
              dashboard where you can view the status of the forms you make.
            </li>
          </ul>
        </div>
      </div>
    </Page>
  );
}

export default Auth;
