import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Page from "./Page";
import GoBack from "./GoBack";

import "react-little-data-grid/dist/react-little-data-grid.css";
import { DataGrid } from "react-little-data-grid";

import DispatchContext from "../DispatchContext";
import { apiGetFormResponsesJSON } from "../services/api";
import { getAxiosError } from "../services/utils";

function ViewFormResponsesSheet() {
  const { form_uri } = useParams();
  const appDispatch = useContext(DispatchContext);
  const [formInfo, setFormInfo] = useState({ title: "..." });
  const [formResponses, setFormResponses] = useState({
    rows: [],
    cols: [],
  });

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function fetchFormResponses() {
      try {
        const response = await apiGetFormResponsesJSON({
          form_uri,
          req_cancel_token: request.token,
        });
        setFormInfo(response.data.form);
        setFormResponses(response.data.responses);
      } catch (e) {
        appDispatch({
          type: "alertMessage",
          value: getAxiosError(e),
          message_type: "danger",
          heading: "Error",
        });
      }
    }
    fetchFormResponses();
    return () => request.cancel();
  }, [appDispatch, form_uri]);

  return (
    <Page title={`${formInfo.title} responses`} showHeader={true}>
      <div className="m-t-sm">
        <GoBack />
      </div>
      <h1 className="head-underline m-t-sm">{`${formInfo.title} responses`}</h1>
      <DataGrid
        cols={formResponses.cols}
        rows={formResponses.rows}
        showIndexCol
      />
    </Page>
  );
}

export default ViewFormResponsesSheet;
