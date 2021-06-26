import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useImmerReducer } from "use-immer";
import { useParams } from "react-router-dom";
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

  return (
    <Page title="Measuring your performance">
      <h2>Measuring your performance</h2>
      <p>
        This is a sample form to mainly figure out your hidden potential is a
        warrior for the Eldian empire. This is not in anyway a conclusive test.
        Feel free to give it your all. All the best!
      </p>
      <div className="w-100">
        <p>
          Q1. What is your name? <span className="red">*</span>
        </p>
        <input type="text" placeholder="Eren Jaeger" className="smooth w-100" />
      </div>
      <div className="w-100">
        <p>Q2. Describe your childhood in a few words?</p>
        <textarea rows="3" className="smooth w-100"></textarea>
      </div>
      <div className="w-100">
        <p>Q3. Which of the following are you allergic to?</p>
        <label>
          <input type="checkbox" value="Apples" /> Apples
        </label>
        <label>
          <input type="checkbox" value="Oranges" /> Oranges
        </label>
        <label>
          <input type="checkbox" value="Strawberries" /> Strawberries
        </label>
        <label>
          <input type="checkbox" value="Pinecones" /> Pine cones
        </label>
      </div>
      <div className="w-100">
        <p>Q4. Which of these places are you most likely to visit?</p>
        <select className="w-100">
          <option>Eldia</option>
          <option>Marley</option>
        </select>
      </div>
      <div>
        <p>Q5. Choose one carefully</p>
        <label>
          <input type="radio" value="Noair" name="r1" />
          No air for an hour
        </label>
        <label>
          <input type="radio" value="Nowater" name="r1" />
          No water for an hour
        </label>
      </div>

      <div className="m-t-sm">
        <button className="btn btn-b btn-sm">Submit my response</button>
      </div>
    </Page>
  );
}

export default ViewForm;
