import React from "react";
import ReactDOM from "react-dom";

// min.css is the main css library used
// and that is set in index.html
import "./index.css";

import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
