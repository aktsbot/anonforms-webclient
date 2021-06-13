import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Page from "./Page";

import DispatchContext from "../DispatchContext";
import { apiGetForms } from "../services/api";
import { getAxiosError } from "../services/utils";

function Dashboard() {
  const appDispatch = useContext(DispatchContext);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function fetchForms() {
      try {
        const response = await apiGetForms({ req_cancel_token: request.token });
        // TODO: pagination
        setForms(response.data.forms);
      } catch (e) {
        appDispatch({
          type: "alertMessage",
          value: getAxiosError(e),
          message_type: "danger",
          heading: "Error",
        });
      }
    }
    fetchForms();
    return () => request.cancel();
  }, [appDispatch]);

  return (
    <Page title="Your dashboard" showHeader={true}>
      <h1 className="head-underline">Dashboard</h1>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title + creation date YYYY/MM/DD</th>
            <th>Link</th>
            <th>Responses</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form, index) => {
            return (
              <tr key={form.uuid}>
                <td>{index + 1}</td>
                <td>
                  <Link to={`/${form.uri}`}>{form.title}</Link> -{" "}
                  <small>2021/02/09</small>
                </td>
                <td>
                  <Link to={`/${form.uri}`}>{form.uri}</Link>
                </td>
                <td>
                  <Link to={`/${form.uri}/responses`}>23</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Page>
  );
}

export default Dashboard;
