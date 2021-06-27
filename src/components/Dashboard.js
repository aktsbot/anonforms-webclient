import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Page from "./Page";

import DispatchContext from "../DispatchContext";
import { apiGetForms } from "../services/api";
import { getAxiosError, makeFormattedDate } from "../services/utils";

function Dashboard() {
  const appDispatch = useContext(DispatchContext);
  const [forms, setForms] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function fetchForms() {
      try {
        const response = await apiGetForms({
          page,
          req_cancel_token: request.token,
        });
        setForms(response.data.forms);
        setCount(response.data.count);
        setTotalPages(response.data.total_pages);
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
    if (nextOrPrev === "p" && page !== 1) {
      setPage(page - 1);
    }
    if (nextOrPrev === "n" && page < totalPages) {
      setPage(page + 1);
    }
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
                  <span>{form.title}</span> -{" "}
                  <small>
                    <code>{makeFormattedDate(form.createdAt)}</code>
                  </small>
                </td>
                <td>
                  <Link to={`/${form.uri}`}>{form.uri}</Link>
                </td>
                <td>
                  {form.response_count > 0 ? (
                    <Link to={`/${form.uri}/responses`}>
                      {form.response_count}
                    </Link>
                  ) : (
                    <span>{form.response_count}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="row m-y-sm">
        <div className="col c6">
          {page > 1 && (
            <button className="btn-link" onClick={() => changePage("p")}>
              &lt;Prev&nbsp;
            </button>
          )}
          Page {page} of {totalPages + " "}
          {page < totalPages && (
            <button className="btn-link" onClick={() => changePage("n")}>
              Next&gt;
            </button>
          )}
        </div>
        <div className="col c6">{count} forms in total</div>
      </div>
    </Page>
  );
}

export default Dashboard;
