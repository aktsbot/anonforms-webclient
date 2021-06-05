import React from "react";
import Page from "./Page";

function NewForm() {
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
        />
      </div>
      <div className="w-100">
        <p>Give it a good description</p>
        <textarea
          className="smooth w-100"
          placeholder="People who wish to submit their RSVP for the conference may give their details below. Thank you for your interest."
        ></textarea>
      </div>

      <h2 className="head-underline">Questions</h2>

      <div className="card">
        <div className="w-100">
          <p>
            <strong>Q1</strong>
          </p>
          <small className="grey">
            <strong>Simple text:</strong> displays as a normal input box on the
            form
          </small>
          <p>Question text</p>
          <input className="smooth w-100" placeholder="What is your name? " />
        </div>
        <div className="m-t-sm text-right">
          <button className="btn btn-sm btn-a">Move up</button>
          <button className="btn btn-sm btn-c">Remove question</button>
        </div>
      </div>

      <div className="card">
        <div className="w-100">
          <p>
            <strong>Q2</strong>
          </p>
          <small className="grey">
            <strong>Large text:</strong> displays as a textarea on the form.
          </small>
          <p>Question text</p>
          <input
            className="smooth w-100"
            placeholder="Describe your daily routines in detail? "
          />
        </div>
        <div className="m-t-sm text-right">
          <button className="btn btn-sm btn-a">Move up</button>
          <button className="btn btn-sm btn-c">Remove question</button>
        </div>
      </div>

      <div className="card">
        <div className="w-100">
          <p>
            <strong>Q3</strong>
          </p>
          <small className="grey">
            <strong>Checkbox:</strong>
            displays as a group of checkboxes on the form. User would select
            more than one checkbox.
          </small>
          <p>Question text</p>
          <input
            className="smooth w-100"
            placeholder="Please choose the items you are allergic to? "
          />
          <p>Question options</p>
          <input className="smooth w-100" placeholder="Peanuts" />
          <input className="smooth w-100 m-t-sm" placeholder="Strawberries" />
          <div className="m-t-sm">
            <a href="/">Add new option</a>
          </div>
        </div>
        <div className="m-t-sm text-right">
          <button className="btn btn-sm btn-a">Move up</button>
          <button className="btn btn-sm btn-c">Remove question</button>
        </div>
      </div>

      <div className="card">
        <div className="w-100">
          <p>
            <strong>Q4</strong>
          </p>
          <small className="grey">
            <strong>Radio:</strong>
            displays as a group of radio options on the form. User would select
            only one option.
          </small>
          <p>Question text</p>
          <input className="smooth w-100" placeholder="Are you married? " />
          <p>Question options</p>
          <input className="smooth w-100" placeholder="Yes" />
          <input className="smooth w-100 m-t-sm" placeholder="No" />
          <div className="m-t-sm">
            <a href="/">Add new option</a>
          </div>
        </div>
        <div className="m-t-sm text-right">
          <button className="btn btn-sm btn-a">Move up</button>
          <button className="btn btn-sm btn-c">Remove question</button>
        </div>
      </div>

      <div className="card">
        <div className="w-100">
          <p>
            <strong>Q5</strong>
          </p>
          <small className="grey">
            <strong>Dropdown:</strong>
            displays as a dropdown on the form. This is useful if this question
            has a lot of options to choose from. User would select only one
            option.
          </small>
          <p>Question text</p>
          <input
            className="smooth w-100"
            placeholder="Which state are you from? "
          />
          <p>Question options</p>
          <input className="smooth w-100" placeholder="Punjab" />
          <input className="smooth w-100 m-t-sm" placeholder="Karnataka" />
          <div className="m-t-sm">
            <a href="/">Add new option</a>
          </div>
        </div>
        <div className="m-t-sm text-right">
          <button className="btn btn-sm btn-a">Move up</button>
          <button className="btn btn-sm btn-c">Remove question</button>
        </div>
      </div>

      <div className="msg m-t-sm">
        <p>To add a question, please click on any one of the items below.</p>
        <ul>
          <li>
            <a href="/">Simple text</a> - for single line answers.
          </li>
          <li>
            <a href="/">Large text</a> - for answers taking up multiple lines.
          </li>
          <li>
            <a href="/">Checkbox</a> - for questions that can have multiple
            right answers.
          </li>
          <li>
            <a href="/">Radio</a> - for questions that can have only one right
            answer.
          </li>
          <li>
            <a href="/">Dropdown</a> - for questions that have a huge list of
            answers to choose from.
          </li>
        </ul>
      </div>

      <div className="text-center m-b-sm m-t-sm">
        <button className="btn btn-b">Submit and create my form</button>
      </div>
    </Page>
  );
}

export default NewForm;
