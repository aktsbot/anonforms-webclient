import React, { useContext } from "react";
import { Redirect, Link } from "react-router-dom";

import StateContext from "../StateContext";
import Page from "./Page";

function Index() {
  const appState = useContext(StateContext);

  return appState.isLoggedIn ? (
    <Redirect to="/dashboard" />
  ) : (
    <Page title="Build and share forms anonymously">
      <div className="text-center">
        <h1 className="head-underline">Anonforms</h1>

        <div className="row">
          <div className="col c4">
            <h2>Anonymous</h2>
            <ul className="text-left">
              <li>
                Authorize with any email-id and get started with making forms.
              </li>
              <li>
                Feel free to use a disposable-mail services like{" "}
                <a href="//mailinator.com">mailinator.com</a> or{" "}
                <a href="//yopmail.com">yopmail</a>.
              </li>
              <li>
                Email IDs are <strong>hashed</strong> before being added to the
                system.
              </li>
            </ul>
          </div>
          <div className="col c4">
            <h2>Self-hosted</h2>
            <ul className="text-left">
              <li>Power to the users. Run your own instance of anonforms!</li>
              <li>
                Check out the{" "}
                <a href="//github.com/aktsbot/anonforms-server/documentation.md">
                  installation guide
                </a>
                .
              </li>
            </ul>
          </div>
          <div className="col c4">
            <h2>Free and open source</h2>
            <ul className="text-left">
              <li>Built with React, NodeJS and MongoDB.</li>
              <li>
                Check out the source code on{" "}
                <a href="//github.com/aktsbot/anonforms-server">github.com</a>.
              </li>
            </ul>
          </div>
        </div>

        <div className="row text-center m-t-sm m-b-sm">
          <Link to="/auth" className="btn btn-b smooth">
            Get started
          </Link>
        </div>
      </div>
    </Page>
  );
}

export default Index;
