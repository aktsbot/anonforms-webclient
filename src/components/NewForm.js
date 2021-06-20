import React, { useContext } from "react";
import { useImmerReducer } from "use-immer";
import Page from "./Page";

import DispatchContext from "../DispatchContext";

function NewForm() {
  const appDispatch = useContext(DispatchContext);

  const initialState = {
    title: "",
    description: "",
    uri: "",
    questions: [],
    formLooksGood: false,
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
        } else if (action.value === "radio") {
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
        draft.questions[action.value]["question_options"].push({
          id: new Date().getTime(),
          title: "",
        });
        return;
      default:
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(newFormReducer, initialState);

  return (
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
                      <input
                        type="text"
                        className={`smooth w-100 ${className}`}
                        placeholder={oindex % 2 === 0 ? "Yes" : "No"}
                        key={`radio-opts--${o.id}`}
                      />
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
            <a href="/">Checkbox</a> - for questions that can have multiple
            right answers.
          </li>
          <li>
            <a href="/">Dropdown</a> - for questions that have a huge list of
            answers to choose from.
          </li>
        </ul>
      </div>

      <div className="text-center m-b-sm m-t-sm">
        <button className="btn btn-b" disabled={state.formLooksGood}>
          Submit and create my form
        </button>
      </div>
    </Page>
  );
}

export default NewForm;
