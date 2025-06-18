import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Page from "./Page";

import DispatchContext from "../DispatchContext";
import {
  apiGetFormResponseList,
  apiGetFormResponsesCSV,
} from "../services/api";
import { getAxiosError, makeFormattedDate } from "../services/utils";

function ViewFormResponses() {
  const { form_uri } = useParams();
  const appDispatch = useContext(DispatchContext);
  const [formInfo, setFormInfo] = useState({ title: "..." });
  const [formResponses, setFormResponses] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [downloadCSV, setDownloadCSV] = useState(0);

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

  useEffect(() => {
    const request = axios.CancelToken.source();
    async function download() {
      try {
        const response = await apiGetFormResponsesCSV({
          form_uri,
          req_cancel_token: request.token,
        });
        const fileName =
          formInfo.title.toLowerCase().replace(/ /g, "-") + ".csv";
        // https://stackoverflow.com/questions/43432892/force-download-get-request-using-axios
        if (!window.navigator.msSaveOrOpenBlob) {
          // BLOB NAVIGATOR
          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
        } else {
          // BLOB FOR EXPLORER 11
          window.navigator.msSaveOrOpenBlob(new Blob([response]), fileName);
        }
        setDownloadCSV(0);
      } catch (e) {
        appDispatch({
          type: "alertMessage",
          value: getAxiosError(e),
          message_type: "danger",
          heading: "Error",
        });
        setDownloadCSV(0);
      }
    }

    if (downloadCSV) {
      download();
    }

    return () => {
      setDownloadCSV(0);
      request.cancel();
    };
  }, [downloadCSV, form_uri, appDispatch, formInfo.title]);

  function changePage(nextOrPrev) {
    if (nextOrPrev === "p" && page !== 1) {
      setPage(page - 1);
    }
    if (nextOrPrev === "n" && page < totalPages) {
      setPage(page + 1);
    }
  }

  return (
    <Page title={`${formInfo.title} responses`} showHeader={true}>
      <h1 className="head-underline">{`${formInfo.title} responses`}</h1>

      <div className="row text-right">
        <Link className="btn-link" to={`/${form_uri}/responses/sheet`}>
          View responses
        </Link>{" "}
        |{" "}
        <button
          className="btn-link"
          onClick={() => {
            if (downloadCSV === 0) {
              setDownloadCSV(1);
            }
          }}
        >
          Download responses
        </button>
      </div>

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
        <div className="col c6 text-right">{count} total responses</div>
      </div>
    </Page>
  );
}

export default ViewFormResponses;
