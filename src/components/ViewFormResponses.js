import React from "react";
import Page from "./Page";

function ViewFormResponses() {
  return (
    <Page title="IPHACON Registration form responses" showHeader={true}>
      <h1 className="head-underline">IPHACON Registration form responses</h1>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Response from &plus; date YYYY/MM/DD</th>
            <th>Attempted</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>
              <a href="/">miko@gmail.com</a> - <small>2021/02/09</small>
            </td>
            <td>2/4</td>
          </tr>
          <tr>
            <td>2</td>
            <td>
              <a href="/">swarup bhatt</a> - <small>2021/02/03</small>
            </td>
            <td>4/4</td>
          </tr>
          <tr>
            <td>3</td>
            <td>
              <a href="/">trent@reznor.com</a> - <small>2021/01/29</small>
            </td>
            <td>3/4</td>
          </tr>
        </tbody>
      </table>

      <div className="row">
        <div className="col c4">
          <a href="/">&lt;Prev</a>
          Page 1 of 3<a href="/">Next&gt;</a>
        </div>
        <div className="col c4">343 total responses</div>
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
