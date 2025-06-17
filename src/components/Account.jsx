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

function Account() {
  const appDispatch = useContext(DispatchContext);

  const initialState = {
    sessions: [],
    sessionToDelete: null,
    accountDeleteText: "Delete my account",
    confirmDeleteText: "",
    deleteAccount: false,
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
      case "sessionToDelete":
        draft.sessionToDelete = action.value;
        return;
      case "sessionDeleted":
        const sessionToDelete = draft.sessionToDelete;
        draft.sessions = draft.sessions.filter(
          (s) => s.session_token !== sessionToDelete
        );
        draft.sessionToDelete = null;
        return;
      case "deleteAccount":
        draft.deleteAccount = true;
        return;
      case "confirmDeleteText":
        draft.confirmDeleteText = action.value;
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

    return () => request.cancel();
  }, [appDispatch, dispatch]);

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function deleteSession() {
      try {
        await apiRemoveSession({
          session_token: state.sessionToDelete,
          req_cancel_token: request.token,
        });
        appDispatch({
          type: "alertMessage",
          value: "Session has been removed",
          message_type: "success",
          heading: "Success!",
        });
        dispatch({ type: "sessionDeleted" });
      } catch (e) {
        appDispatch({
          type: "alertMessage",
          value: getAxiosError(e),
          message_type: "danger",
          heading: "Error",
        });
      }
    }

    if (state.sessionToDelete) {
      deleteSession();
    }
  }, [state.sessionToDelete, appDispatch, dispatch]);

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function deleteAccount() {
      try {
        await apiRemoveAccount({
          session_token: state.sessionToDelete,
          req_cancel_token: request.token,
        });
        appDispatch({
          type: "alertMessage",
          value: "Your account has been deleted",
          message_type: "success",
          heading: "Success!",
        });
        appDispatch({ type: "logout" });
      } catch (e) {
        appDispatch({
          type: "alertMessage",
          value: getAxiosError(e),
          message_type: "danger",
          heading: "Error",
        });
      }
    }

    if (state.deleteAccount) {
      deleteAccount();
    }
  }, [state.deleteAccount, appDispatch, state.sessionToDelete]);

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
                    <button
                      className="btn-link"
                      onClick={() =>
                        dispatch({
                          type: "sessionToDelete",
                          value: s.session_token,
                        })
                      }
                    >
                      Remove this session
                    </button>
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
      <input
        type="text"
        onChange={(e) =>
          dispatch({ type: "confirmDeleteText", value: e.target.value })
        }
        className="smooth w-100"
        placeholder="Type it here"
      />
      <div className="m-y-sm">
        <button
          className="btn btn-sm btn-c"
          disabled={state.accountDeleteText !== state.confirmDeleteText}
          onClick={() => dispatch({ type: "deleteAccount" })}
        >
          Delete account
        </button>
      </div>
    </Page>
  );
}

export default Account;
