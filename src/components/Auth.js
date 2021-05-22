import React from "react";
import Page from "./Page";

function Auth() {
  return (
    <Page title="Authentication">
      <h2>Enter your email to authenticate</h2>
      <div className="row">
        <form className="">
          <label htmlFor="auth-email">Email ID</label>
          <input
            type="email"
            placeholder="alice@example.com"
            required
            id="auth-email"
            className="smooth w-100"
          />
          <label htmlFor="auth-code">Your secret code sent via email</label>
          <input
            type="text"
            placeholder="AC-abcde12345"
            required
            id="auth-code"
            className="smooth w-100"
          />
          <button type="submit" className="btn btn-sm btn-b">
            Continue
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
