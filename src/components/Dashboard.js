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
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function fetchForms() {
      try {
        const response = await apiGetForms({
          page,
          req_cancel_token: request.token,
        });
        // TODO: pagination
        setForms(response.data.forms);
        setCount(response.data.count);
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
  }, [appDispatch, page]);

  // TODO: duh!
  function changePage(nextOrPrev) {
    setPage(1);
  }

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
      <div className="row m-y-sm">
        <div className="col c6">
          <button className="btn-link" onClick={() => changePage("p")}>
            &lt;Prev
          </button>{" "}
          Page {page} of 3{" "}
          <button className="btn-link" onClick={() => changePage("n")}>
            Next&gt;
          </button>
        </div>
        <div className="col c6">{count} forms in total</div>
      </div>
    </Page>
  );
}

export default Dashboard;
