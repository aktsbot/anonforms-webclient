import React, { useEffect, useContext, useMemo } from "react";
import { Redirect } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import axios from "axios";
import Page from "./Page";

import DispatchContext from "../DispatchContext";
import { createForm } from "../services/api";
import { getAxiosError } from "../services/utils";

function NewForm() {
  const appDispatch = useContext(DispatchContext);

  const initialState = {
    title: "",
    description: "",
    uri: "",
    questions: [],
    submitCount: 0,
    isFormCreated: false,
  };

  const newFormReducer = (draft, action) => {
    switch (action.type) {
      case "titleChange":
        draft.title = action.value;
        draft.uri = action.value.toLowerCase().replace(/ /g, "-");
        return;
      case "descriptionChange":
        draft.description = action.value;
        return;
      case "addQuestion":
        let questionPayload = {
          // Note: i couldn't use index in the map method while rendering the UI, as it was not updating
          id: new Date().getTime(),
          is_required: false,
          title: "",
        };
        if (action.value === "simple_text" || action.value === "large_text") {
          questionPayload = { ...questionPayload, question_type: action.value };
        } else if (
          action.value === "radio" ||
          action.value === "checkbox" ||
          action.value === "dropdown"
        ) {
          questionPayload = {
            ...questionPayload,
            question_type: action.value,
            question_options: [{ id: new Date().getTime(), title: "" }],
          };
        }
        draft.questions.push(questionPayload);
        return;
      case "removeQuestion":
        draft.questions.splice(action.value, 1);
        return;
      case "moveQuestionUp":
        const old = draft.questions[action.value - 1];
        const current = draft.questions[action.value];
        draft.questions[action.value - 1] = current;
        draft.questions[action.value] = old;
        return;
      case "questionTitleChange":
        draft.questions[action.index]["title"] = action.value;
        return;
      case "addRadioOption":
      case "addCheckboxOption":
      case "addDropdownOption":
        draft.questions[action.value]["question_options"].push({
          id: new Date().getTime(),
          title: "",
        });
        return;
      case "questionOptionChange":
        draft.questions[action.questionIndex]["question_options"][
          action.optionIndex
        ]["title"] = action.value;
        return;
      case "removeRadioOption":
      case "removeCheckboxOption":
      case "removeDropdownOption":
        draft.questions[action.questionIndex]["question_options"].splice(
          action.optionIndex,
          1
        );
        return;
      case "submitForm":
        draft.submitCount += 1;
        return;
      case "formCreated":
        draft.isFormCreated = true;
        return;
      default:
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(newFormReducer, initialState);

  const isFormValid = useMemo(() => {
    if (!state.title || !state.description || !state.uri) {
      return false;
    }

    if (!state.questions.length) {
      return false;
    }

    for (const q of state.questions) {
      if (!q.title) {
        return false;
      }
      if (
        q.question_type === "radio" ||
        q.question_type === "checkbox" ||
        q.question_type === "dropdown"
      ) {
        if (!q.question_options.length) {
          // Note: the dispatch takes care of inserting atleast one option, but this is a fail-safe
          return false;
        }
        for (const o of q.question_options) {
          if (!o.title) {
            return false;
          }
        }
      }
    }
    return true;
  }, [state]);

  useEffect(() => {
    const request = axios.CancelToken.source();
    async function createNewForm(payload) {
      try {
        await createForm({ payload, req_cancel_token: request.token });
        appDispatch({
          type: "alertMessage",
          value: "Your form has been created",
          message_type: "success",
          heading: "Woot woot!",
        });
        dispatch({ type: "formCreated" });
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
        title: state.title,
        description: state.description,
        uri: state.uri,
        questions: state.questions.map((q) => {
          let newQ = { ...q };
          // removing id, as the backend throws an error, if the payload doesnot
          // match its schema
          delete newQ.id;
          if (newQ.question_options) {
            newQ.question_options = newQ.question_options.map((qo) => {
              let newOption = { ...qo };
              // remove id, as backend does not expects it
              delete newOption.id;
              return newOption;
            });
          }
          return newQ;
        }),
      };
      createNewForm(payload);
    }

    return () => request.cancel();
  }, [
    state.submitCount,
    appDispatch,
    dispatch,
    state.title,
    state.description,
    state.questions,
    state.uri,
  ]);

  return state.isFormCreated ? (
    <Redirect to="/dashboard" />
  ) : (
    <Page title="Create your new form" showHeader={true}>
      <h1 className="head-underline">Create your new form</h1>

      <div className="msg">
        Remember to give your form a short title and give it a good description
        to make it very clear to the recipient, what you are asking them.
      </div>

      <div className="w-100">
        <p>What is your form's title?</p>
        <input
          type="text"
          className="smooth w-100"
          placeholder="Registration form for Foo Conference"
          onChange={(e) =>
            dispatch({ type: "titleChange", value: e.target.value })
          }
        />
      </div>
      <div className="w-100">
        <p>Give it a good description</p>
        <textarea
          className="smooth w-100"
          placeholder="People who wish to submit their RSVP for the conference may give their details below. Thank you for your interest."
          onChange={(e) =>
            dispatch({ type: "descriptionChange", value: e.target.value })
          }
        ></textarea>
      </div>

      <h2 className="head-underline">Questions</h2>

      {state.questions.length === 0 && <p>No questions added yet!</p>}

      {state.questions.map((q, index) => {
        return (
          <div className="card" key={"q--" + q.id}>
            <div className="w-100">
              <p>
                <strong>Q{index + 1}</strong>
              </p>
              <small className="grey">
                {q.question_type === "simple_text" && (
                  <>
                    <strong>Simple text:</strong> displays as a normal input box
                    on the form.
                  </>
                )}

                {q.question_type === "large_text" && (
                  <>
                    <strong>Large text:</strong> displays as a textarea on the
                    form.
                  </>
                )}

                {q.question_type === "radio" && (
                  <>
                    <strong>Radio:</strong> displays as a group of radio options
                    on the form. User would select only one option.
                  </>
                )}

                {q.question_type === "checkbox" && (
                  <>
                    <strong>Checkbox:</strong> displays as a group of checkboxes
                    on the form. User would select more than one checkbox.
                  </>
                )}

                {q.question_type === "dropdown" && (
                  <>
                    <strong>Dropdown:</strong> displays as a dropdown on the
                    form. This is useful if this question has a lot of options
                    to choose from. User would select only one option.
                  </>
                )}
              </small>
              <p>Question text</p>
              {q.question_type === "simple_text" && (
                <input
                  type="text"
                  className="smooth w-100"
                  placeholder="What is your name? "
                  onChange={(e) =>
                    dispatch({
                      type: "questionTitleChange",
                      value: e.target.value,
                      index: index,
                    })
                  }
                />
              )}
              {q.question_type === "large_text" && (
                <input
                  type="text"
                  className="smooth w-100"
                  placeholder="Describe your daily routines in detail? "
                  onChange={(e) =>
                    dispatch({
                      type: "questionTitleChange",
                      value: e.target.value,
                      index: index,
                    })
                  }
                />
              )}
              {q.question_type === "radio" && (
                <>
                  <input
                    type="text"
                    className="smooth w-100"
                    placeholder="Are you married? "
                    onChange={(e) =>
                      dispatch({
                        type: "questionTitleChange",
                        value: e.target.value,
                        index: index,
                      })
                    }
                  />
                  <p>Question options</p>
                  {q.question_options.map((o, oindex) => {
                    let className = oindex ? "m-t-sm" : "";
                    return (
                      <div key={`radio-opts--${o.id}`}>
                        <input
                          type="text"
                          className={`smooth w-100 ${className}`}
                          placeholder={oindex % 2 === 0 ? "Yes" : "No"}
                          onChange={(e) =>
                            dispatch({
                              type: "questionOptionChange",
                              value: e.target.value,
                              optionIndex: oindex,
                              questionIndex: index,
                            })
                          }
                        />
                        {oindex !== 0 && (
                          <button
                            className="btn-link small"
                            onClick={() =>
                              dispatch({
                                type: "removeRadioOption",
                                questionIndex: index,
                                optionIndex: oindex,
                              })
                            }
                          >
                            Remove option
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <div className="m-t-sm">
                    <button
                      className="btn-link"
                      onClick={() =>
                        dispatch({ type: "addRadioOption", value: index })
                      }
                    >
                      Add new option
                    </button>
                  </div>
                </>
              )}
              {q.question_type === "checkbox" && (
                <>
                  <input
                    type="text"
                    className="smooth w-100"
                    placeholder="Please choose the items you are allergic to? "
                    onChange={(e) =>
                      dispatch({
                        type: "questionTitleChange",
                        value: e.target.value,
                        index: index,
                      })
                    }
                  />
                  <p>Question options</p>
                  {q.question_options.map((o, oindex) => {
                    let className = oindex ? "m-t-sm" : "";
                    return (
                      <div key={`checkbox-opts--${o.id}`}>
                        <input
                          type="text"
                          className={`smooth w-100 ${className}`}
                          placeholder={
                            oindex % 2 === 0 ? "Peanuts" : "Strawberries"
                          }
                          onChange={(e) =>
                            dispatch({
                              type: "questionOptionChange",
                              value: e.target.value,
                              optionIndex: oindex,
                              questionIndex: index,
                            })
                          }
                        />
                        {oindex !== 0 && (
                          <button
                            className="btn-link small"
                            onClick={() =>
                              dispatch({
                                type: "removeCheckboxOption",
                                questionIndex: index,
                                optionIndex: oindex,
                              })
                            }
                          >
                            Remove option
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <div className="m-t-sm">
                    <button
                      className="btn-link"
                      onClick={() =>
                        dispatch({ type: "addCheckboxOption", value: index })
                      }
                    >
                      Add new option
                    </button>
                  </div>
                </>
              )}

              {q.question_type === "dropdown" && (
                <>
                  <input
                    type="text"
                    className="smooth w-100"
                    placeholder="Which state are you from? "
                    onChange={(e) =>
                      dispatch({
                        type: "questionTitleChange",
                        value: e.target.value,
                        index: index,
                      })
                    }
                  />
                  <p>Question options</p>
                  {q.question_options.map((o, oindex) => {
                    let className = oindex ? "m-t-sm" : "";
                    return (
                      <div key={`dropdown-opts--${o.id}`}>
                        <input
                          type="text"
                          className={`smooth w-100 ${className}`}
                          placeholder={
                            oindex % 2 === 0 ? "Karnataka" : "Punjab"
                          }
                          onChange={(e) =>
                            dispatch({
                              type: "questionOptionChange",
                              value: e.target.value,
                              optionIndex: oindex,
                              questionIndex: index,
                            })
                          }
                        />

                        {oindex !== 0 && (
                          <button
                            className="btn-link small"
                            onClick={() =>
                              dispatch({
                                type: "removeCheckboxOption",
                                questionIndex: index,
                                optionIndex: oindex,
                              })
                            }
                          >
                            Remove option
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <div className="m-t-sm">
                    <button
                      className="btn-link"
                      onClick={() =>
                        dispatch({ type: "addDropdownOption", value: index })
                      }
                    >
                      Add new option
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="m-t-sm text-right">
              {index !== 0 && (
                <button
                  className="btn btn-sm btn-a"
                  onClick={() =>
                    dispatch({ type: "moveQuestionUp", value: index })
                  }
                >
                  Move up
                </button>
              )}
              <button
                className="btn btn-sm btn-c m-l-sm"
                onClick={() => {
                  console.log(index);
                  dispatch({ type: "removeQuestion", value: index });
                }}
              >
                Remove question
              </button>
            </div>
          </div>
        );
      })}

      <div className="msg m-t-sm">
        <p>To add a question, please click on any one of the items below.</p>
        <ul>
          <li>
            <button
              className="btn-link"
              onClick={() =>
                dispatch({ type: "addQuestion", value: "simple_text" })
              }
            >
              Simple text
            </button>{" "}
            - for single line answers.
          </li>
          <li>
            <button
              className="btn-link"
              onClick={() =>
                dispatch({ type: "addQuestion", value: "large_text" })
              }
            >
              Large text
            </button>{" "}
            - for answers taking up multiple lines.
          </li>
          <li>
            <button
              className="btn-link"
              onClick={() => dispatch({ type: "addQuestion", value: "radio" })}
            >
              Radio
            </button>{" "}
            - for questions that can have only one right answer.
          </li>
          <li>
            <button
              className="btn-link"
              onClick={() =>
                dispatch({ type: "addQuestion", value: "checkbox" })
              }
            >
              Checkbox
            </button>{" "}
            - for questions that can have multiple right answers.
          </li>
          <li>
            <button
              className="btn-link"
              onClick={() =>
                dispatch({ type: "addQuestion", value: "dropdown" })
              }
            >
              Dropdown
            </button>{" "}
            - for questions that have a huge list of answers to choose from.
          </li>
        </ul>
      </div>

      <div className="text-center m-b-sm m-t-sm">
        <button
          className="btn btn-b"
          disabled={!isFormValid}
          onClick={() => dispatch({ type: "submitForm" })}
        >
          Submit and create my form
        </button>
      </div>
    </Page>
  );
}

export default NewForm;
