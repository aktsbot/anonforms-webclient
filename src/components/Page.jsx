import React, { useEffect } from "react";
import Container from "./Container";

function Page(props) {
  useEffect(() => {
    document.title = `${props.title} | Anonforms`;
    window.scrollTo(0, 0);
  }, [props.title]);

  return <Container showHeader={props.showHeader}>{props.children}</Container>;
}

export default Page;
