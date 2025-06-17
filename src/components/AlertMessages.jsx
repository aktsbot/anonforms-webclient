import React, { useContext } from "react";

import DispatchContext from "../DispatchContext";

function AlertMessages(props) {
  const appDispatch = useContext(DispatchContext);

  return (
    <div>
      {props.messages.map((msg, index) => {
        return (
          <div
            className={
              "alert " + (Boolean(msg.type) ? `alert-${msg.type}` : "")
            }
            key={`alert--${index}`}
          >
            <span
              className="closebtn"
              onClick={() =>
                appDispatch({ type: "alertMessageClear", value: index })
              }
            >
              &times;
            </span>
            {msg.heading && <strong>{msg.heading}</strong>} {msg.message}
          </div>
        );
      })}
    </div>
  );
}

export default AlertMessages;
