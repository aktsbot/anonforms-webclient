import React from "react";

import Header from "./Header";

function Container(props) {
  return (
    <>
      {props.showHeader ? <Header /> : ""}
      <div className="container">{props.children}</div>
    </>
  );
}

export default Container;
