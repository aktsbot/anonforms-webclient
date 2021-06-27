import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useImmerReducer } from "use-immer";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import Page from "./Page";

import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { apiGetForm, apiSubmitFormResponse } from "../services/api";
import { getAxiosError, getRandomString } from "../services/utils";

function ViewForm() {
  // TODO: add state and bind view to state
  // there is also a style issue with checkboxes
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const { form_uri } = useParams();

  const initialState = {
    username: appState.formUser.name, // the person who responds to the form and not the person who made it!
    answers: [],
    formFound: true, // will be changed once the api call to backend is done
    formInfo: null,
    formUri: form_uri,
    showUsernameModal: !Boolean(appState.formUser.name),
    suggestedUsername: appState.formUser.name || getRandomString(6),
    submitCount: 0,
  };

  const viewFormReducer = (draft, action) => {
    switch (action.type) {
      case "formFound":
        draft.formFound = true;
        draft.formInfo = action.value;
        return;
      case "formNotFound":
        draft.formFound = false;
        return;
      case "usernameModal":
        // dont close the modal, if the username is not given
        if (!action.value && !draft.suggestedUsername) {
          return;
        }
        draft.showUsernameModal = action.value;
        return;
      case "suggestedUsername":
        draft.suggestedUsername = action.value;
        return;
      case "setUsername":
        draft.username = action.value;
        return;
      case "emptyAnswers":
        draft.answers = action.value;
        return;
      case "addAnswer":
        const index = draft.answers.findIndex((a) => a.question === action.qid);
        if (index === -1) {
          return;
        }
        if (action.qtype === "simple_text" || action.qtype === "large_text") {
          draft.answers[index]["answer_text"] = action.value;
        } else if (action.qtype === "radio" || action.qtype === "dropdown") {
          draft.answers[index]["answer_single_option"] = action.value;
        } else if (action.qtype === "checkbox") {
          const optIndex = draft.answers[index][
            "answer_multiple_option"
          ].indexOf(action.value);
          if (optIndex === -1) {
            draft.answers[index]["answer_multiple_option"].push(action.value);
          } else {
            // we remove it
            draft.answers[index]["answer_multiple_option"].splice(optIndex, 1);
          }
        }
        return;
      case "submitForm":
        draft.submitCount += 1;
        return;
      default:
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(viewFormReducer, initialState);

  const makeEmptyAnswers = (questions) => {
    const answers = [];
    for (const q of questions) {
      let qObj = {
        question: q._id,
      };
      if (
        q.question_type === "simple_text" ||
        q.question_type === "large_text"
      ) {
        qObj.answer_text = "";
      } else if (
        q.question_type === "radio" ||
        q.question_type === "dropdown"
      ) {
        qObj.answer_single_option = "";
      } else if (q.question_type === "checkbox") {
        qObj.answer_multiple_option = [];
      }
      answers.push(qObj);
    }
    return answers;
  };

  useEffect(() => {
    if (!state.username) {
      dispatch({ type: "usernameModal", value: true });
    }
    if (state.suggestedUsername) {
      dispatch({ type: "setUsername", value: state.suggestedUsername });
      appDispatch({ type: "formUser", value: state.suggestedUsername });
    }
    return;
  }, [state.username, state.suggestedUsername, appDispatch, dispatch]);

  useEffect(() => {
    const request = axios.CancelToken.source();
    async function fetchForm() {
      try {
        const formInfo = await apiGetForm({
          form_uri: state.formUri,
          req_cancel_token: request.token,
        });
        dispatch({
          type: "formFound",
          value: formInfo.data,
        });
        const emptyAns = makeEmptyAnswers(formInfo.data.questions);
        dispatch({
          type: "emptyAnswers",
          value: emptyAns,
        });
      } catch (e) {
        dispatch({
          type: "formNotFound",
        });
        appDispatch({
          type: "alertMessage",
          value: getAxiosError(e),
          message_type: "danger",
          heading: "Error",
        });
      }
    }
    if (state.formUri) {
      fetchForm();
    }
  }, [state.formUri, dispatch, appDispatch]);

  useEffect(() => {
    const request = axios.CancelToken.source();
    async function createSubmission(payload, form_uuid) {
      try {
        await apiSubmitFormResponse({
          payload,
          req_cancel_token: request.token,
          form_uuid,
        });
        appDispatch({
          type: "alertMessage",
          value: "Your response has been submitted",
          message_type: "success",
          heading: "Thank you!",
        });
        // dispatch({ type: "formSubmitted" });
      } catch (e) {
        appDispatch({
          type: "alertMessage",
          value: getAxiosError(e),
          message_type: "danger",
          heading: "Error",
        });
      }
    }

    if (state.submitCount) {
      const payload = {
        response_from: state.username,
        answers: state.answers,
      };
      createSubmission(payload, state.formInfo.uuid);
    }

    return () => request.cancel();
  }, [
    state.submitCount,
    appDispatch,
    dispatch,
    state.answers,
    state.username,
    state.formInfo,
  ]);

  return !state.formFound ? (
    <NotFound />
  ) : (
    state.formInfo && (
      <Page title={state.formInfo.title}>
        {state.showUsernameModal && (
          <div className="modal">
            <div className="modal-content">
              <span
                class="modal-close-btn"
                onClick={() =>
                  dispatch({ type: "usernameModal", value: false })
                }
              >
                &times;
              </span>
              <h3>A random name</h3>
              <p>
                Hey! Inorder to prevent you from accidentally submitting a form
                more than once, we need to give you a name. This is totally{" "}
                <strong>random</strong> and is <u>kept in your browser</u>.
              </p>
              <p>
                If you don't like the name, go ahead and change it to something
                else.
              </p>
              <input
                type="text"
                className="w-100"
                value={state.suggestedUsername}
                onChange={(e) =>
                  dispatch({ type: "suggestedUsername", value: e.target.value })
                }
              />
              <div className="m-t-sm">
                <button
                  className="btn btn-sm btn-b"
                  onClick={() =>
                    dispatch({ type: "usernameModal", value: false })
                  }
                >
                  Use this name
                </button>
              </div>
            </div>
          </div>
        )}

        {appState.formUser.name && (
          <p className="text-right">
            <button
              className="btn-link"
              onClick={() => dispatch({ type: "usernameModal", value: true })}
            >
              {appState.formUser.name}
            </button>
          </p>
        )}

        <h2>{state.formInfo.title}</h2>
        <p>{state.formInfo.description}</p>
        <form
          className="w-100"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({ type: "submitForm" });
          }}
        >
          {state.formInfo.questions.map((q, index) => {
            return (
              <div className="w-100" key={q._id}>
                <p>
                  Q{index + 1}. {q.title}{" "}
                  {q.is_required && <span className="red">*</span>}
                </p>
                {q.question_type === "simple_text" && (
                  <input
                    type="text"
                    className="smooth w-100"
                    required={q.is_required}
                    onChange={(e) =>
                      dispatch({
                        type: "addAnswer",
                        value: e.target.value,
                        qtype: "simple_text",
                        qid: q._id,
                      })
                    }
                  />
                )}
                {q.question_type === "large_text" && (
                  <textarea
                    rows="3"
                    className="smooth w-100"
                    required={q.is_required}
                    onChange={(e) =>
                      dispatch({
                        type: "addAnswer",
                        value: e.target.value,
                        qtype: "large_text",
                        qid: q._id,
                      })
                    }
                  ></textarea>
                )}
                {q.question_type === "radio" && (
                  <div className="row">
                    {q.question_options.map((qo) => {
                      return (
                        <div key={qo._id} className="col c3">
                          <label>
                            <input
                              type="radio"
                              value={qo._id}
                              name={q._id}
                              onChange={() =>
                                dispatch({
                                  type: "addAnswer",
                                  value: qo._id,
                                  qtype: "radio",
                                  qid: q._id,
                                })
                              }
                            />{" "}
                            {qo.title}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
                {q.question_type === "checkbox" && (
                  <div className="row">
                    {q.question_options.map((qo) => {
                      return (
                        <div key={qo._id} className="col c3">
                          <label>
                            <input
                              type="checkbox"
                              value={qo.id}
                              name={q._id}
                              onChange={() =>
                                dispatch({
                                  type: "addAnswer",
                                  value: qo._id,
                                  qtype: "checkbox",
                                  qid: q._id,
                                })
                              }
                            />{" "}
                            {qo.title}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
                {q.question_type === "dropdown" && (
                  <select
                    className="w-100"
                    onChange={(e) =>
                      dispatch({
                        type: "addAnswer",
                        value: e.target.value,
                        qtype: "dropdown",
                        qid: q._id,
                      })
                    }
                  >
                    {q.question_options.map((qo) => {
                      return (
                        <option key={qo._id} value={qo._id}>
                          {qo.title}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
            );
          })}

          <div className="m-t-sm">
            <button type="submit" className="btn btn-b btn-sm">
              Submit my response
            </button>
          </div>
        </form>
      </Page>
    )
  );
}

export default ViewForm;
