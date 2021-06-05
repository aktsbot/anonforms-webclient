import React from "react";
import Page from "./Page";

function Dashboard() {
  // TODO: add state and bind view
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
          <tr>
            <td>1</td>
            <td>
              <a href="/">IPHACON Registration form</a> -{" "}
              <small>2021/02/09</small>
            </td>
            <td>
              <a href="/">https://foo.com/ha123</a>
            </td>
            <td>
              <a href="/">23</a>
            </td>
          </tr>
        </tbody>
      </table>
    </Page>
  );
}

export default Dashboard;
