import { useEffect, useContext } from "react";

import { useImmerReducer } from "use-immer";
import axios from "axios";

import Page from "./Page";
import {
  apiGetUser,
  apiRemoveSession,
  apiRemoveAccount,
} from "../services/api";
import { getAxiosError, makeFormattedDateTime } from "../services/utils";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function Account() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const initialState = {
    sessions: [],
    sessionToDelete: null,
    showAccountDelete: false,
    confirmDelete: false,
    accountDeleteText: "Delete my account",
    confirmDeleteText: "",
    formAuthorInfo: {
      uuid: "",
      createdAt: "",
    },
  };

  const accountReducer = (draft, action) => {
    switch (action.type) {
      case "sessions":
        draft.sessions = action.value;
        return;
      case "formAuthorInfo":
        draft.formAuthorInfo = action.value;
        return;
      default:
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(accountReducer, initialState);

  useEffect(() => {
    const request = axios.CancelToken.source();
    async function getUser() {
      try {
        const response = await apiGetUser({ req_cancel_token: request.token });
        if (response.data.sessions) {
          dispatch({ type: "sessions", value: response.data.sessions });
        }
        if (response.data.user) {
          dispatch({
            type: "formAuthorInfo",
            value: response.data.user,
          });
        }
      } catch (e) {
        appDispatch({
          type: "alertMessage",
          value: getAxiosError(e),
          message_type: "danger",
          heading: "Error",
        });
      }
    }

    getUser();
  }, []);

  return (
    <Page title="Account" showHeader={true}>
      <h1 className="head-underline">Account</h1>
      <p>
        Account ID:{" "}
        <strong>
          <code>{state.formAuthorInfo.uuid}</code>
        </strong>
      </p>
      <p>Created on: {makeFormattedDateTime(state.formAuthorInfo.createdAt)}</p>

      <h2 className="head-underline">Sessions</h2>
      <div className="msg">
        Your logged in sessions from different web browsers will be listed here.
        You may remove sessions <strong>other than your current</strong>{" "}
        session.
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Session token</th>
            <th>Last used on</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {state.sessions.map((s, index) => {
            return (
              <tr key={s.session_token}>
                <td>{index + 1}</td>
                <td>{s.session_token} </td>
                <td>{makeFormattedDateTime(s.session_last_used)}</td>
                <td>
                  {s.is_current ? (
                    <small>Current</small>
                  ) : (
                    <button className="btn-link">Remove this session</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 className="head-underline">Delete my account</h2>
      <div className="msg warning">
        This will delete all your forms, their responses and anything related to
        you on the platform.{" "}
        <strong>Your account will be permanently deleted.</strong>
      </div>
      <p>
        To delete your account enter{" "}
        <strong>"{state.accountDeleteText}"</strong> below.
      </p>
      <input type="text" className="smooth w-100" placeholder="Type it here" />
      <div className="m-y-sm">
        <button
          className="btn btn-sm btn-c"
          disabled={state.accountDeleteText !== state.confirmDeleteText}
        >
          Delete account
        </button>
      </div>
    </Page>
  );
}

export default Account;
