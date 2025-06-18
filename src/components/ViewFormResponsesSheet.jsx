import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Page from "./Page";
import GoBack from "./GoBack";

import DispatchContext from "../DispatchContext";
import {
  apiGetFormResponseList,
  apiGetFormResponsesCSV,
} from "../services/api";
import { getAxiosError, makeFormattedDate } from "../services/utils";

function ViewFormResponsesSheet() {
  return (
    <Page title="Sheet" showHeader={true}>
      <div className="m-t-sm">
        <GoBack />
      </div>
      <h1 className="head-underline m-t-sm">{`X responses`}</h1>
    </Page>
  );
}

export default ViewFormResponsesSheet;
