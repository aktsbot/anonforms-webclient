import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Page from "./Page";

import DispatchContext from "../DispatchContext";
import { apiGetFormResponseList } from "../services/api";
import { getAxiosError, makeFormattedDate } from "../services/utils";

function ViewFormResponses() {
  const { form_uri } = useParams();
  const appDispatch = useContext(DispatchContext);
  const [formInfo, setFormInfo] = useState(null);
  const [formResponses, setFormResponses] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function fetchFormResponses() {
      try {
        const response = await apiGetFormResponseList({
          form_uri,
          page,
          req_cancel_token: request.token,
        });
        setFormInfo(response.data.form);
        setFormResponses(response.data.responses);
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
    fetchFormResponses();
    return () => request.cancel();
  }, [appDispatch, page, form_uri]);

  function changePage(nextOrPrev) {
    if (nextOrPrev === "p" && page !== 1) {
      setPage(page - 1);
    }
    if (nextOrPrev === "n" && page < totalPages) {
      setPage(page + 1);
    }
  }

  return (
    <Page title="IPHACON Registration form responses" showHeader={true}>
      <h1 className="head-underline">IPHACON Registration form responses</h1>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Response from + date YYYY/MM/DD</th>
            <th>Attempted</th>
          </tr>
        </thead>
        <tbody>
          {formResponses.map((fr, index) => {
            return (
              <tr key={fr.uuid}>
                <td>{index + 1}</td>
                <td>
                  {fr.response_from} -{" "}
                  <small>
                    <code>{makeFormattedDate(fr.createdAt)}</code>
                  </small>
                </td>
                <td>
                  {fr.answered}/{formInfo.question_count}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="row">
        <div className="col c4">
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
        <div className="col c4">{count} total responses</div>
        <div className="col c4">
          <button className="btn btn-sm btn-a">
            Download responses as csv file
          </button>
        </div>
      </div>
    </Page>
  );
}

export default ViewFormResponses;
