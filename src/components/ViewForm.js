import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useImmerReducer } from "use-immer";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import Page from "./Page";

import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import { apiGetForm } from "../services/api";
import { getAxiosError } from "../services/utils";

function ViewForm() {
  // TODO: add state and bind view to state
  // there is also a style issue with checkboxes
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const { form_uri } = useParams();

  const initialState = {
    username: "", // the person who responds to the form and not the person who made it!
    answers: [],
    formFound: true, // will be changed once the api call to backend is done
    formInfo: null,
    formUri: form_uri,
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
      default:
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(viewFormReducer, initialState);

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

  return !state.formFound ? (
    <NotFound />
  ) : (
    state.formInfo && (
      <Page title={state.formInfo.title}>
        <h2>{state.formInfo.title}</h2>
        <p>{state.formInfo.description}</p>
        <form>
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
                  />
                )}
                {q.question_type === "large_text" && (
                  <textarea
                    rows="3"
                    className="smooth w-100"
                    required={q.is_required}
                  ></textarea>
                )}
                {q.question_type === "radio" &&
                  q.question_options.map((qo) => {
                    return (
                      <label key={qo._id}>
                        <input type="radio" value={qo.id} name={q._id} />{" "}
                        {qo.title}
                      </label>
                    );
                  })}
                {q.question_type === "checkbox" &&
                  q.question_options.map((qo) => {
                    return (
                      <label key={qo._id}>
                        <input type="checkbox" value={qo.id} name={q._id} />{" "}
                        {qo.title}
                      </label>
                    );
                  })}
                {q.question_type === "dropdown" && (
                  <select className="w-100">
                    {q.question_options.map((qo) => {
                      return <option key={qo._id}>{qo.title}</option>;
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
