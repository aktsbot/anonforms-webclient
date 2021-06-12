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
      <h1>Anonforms &mdash; Free &amp; anonymous form builder</h1>
      <p>
        <Link to="/auth">I'm ready to build a form</Link>
      </p>
    </Page>
  );
}

export default Index;
