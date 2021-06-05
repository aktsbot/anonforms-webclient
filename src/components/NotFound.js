import React from "react";
import { Link } from "react-router-dom";

import Page from "./Page";

function NotFound() {
  return (
    <Page title="Page not found">
      <h2>Page not found</h2>
      <p>
        <Link to="/">Go back to the homepage</Link>.
      </p>
    </Page>
  );
}

export default NotFound;
