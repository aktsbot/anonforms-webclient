import axios from "axios";

const __BASE_API_ROUTE__ = "/api/v1";

// this is exported as the auth component uses this to set
// the authorization token afterwards
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_API + __BASE_API_ROUTE__,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default http;
// this is called to set the auth token after login
export const setAuthHeader = ({ token }) => {
  http.defaults.headers.common = { "x-af-auth": `${token}` };
  return;
};

// all api endpoint methods are set here as the entire app is tiny

// sends a secret code to the email provided
export const apiAuth = ({ email, req_cancel_token }) => {
  return http.post("/user/auth", { email }, { cancelToken: req_cancel_token });
};

// gets a session token from the provided email and auth_code
export const apiSession = ({ email, auth_code, req_cancel_token }) => {
  return http
    .post(
      "/user/session",
      { email, auth_code },
      { cancelToken: req_cancel_token }
    )
    .then((res) => res.data);
};

// gets user info for a session
export const apiGetUser = ({ req_cancel_token }) => {
  return http
    .get("/user", { cancelToken: req_cancel_token })
    .then((res) => res.data);
};

// remove a session
export const apiRemoveSession = ({ session_token, req_cancel_token }) => {
  return http
    .delete(
      `/user/session/${session_token}`,
      {},
      { cancelToken: req_cancel_token }
    )
    .then((res) => res.data);
};

// removes an account
export const apiRemoveAccount = ({ req_cancel_token }) => {
  return http
    .delete("/user/account", {}, { cancelToken: req_cancel_token })
    .then((res) => res.data);
};

// logout - devalidates a session token
export const apiLogout = () => {
  return http.post("/user/logout", {});
};

// forms apis
// gets all forms made by a form author
export const apiGetForms = ({ page, req_cancel_token }) => {
  const params = {
    page: 1,
  };
  if (page) {
    params.page = page;
  }
  return http
    .get("/form", { params }, { cancelToken: req_cancel_token })
    .then((res) => res.data);
};

export const apiCreateForm = ({ payload, req_cancel_token }) => {
  return http
    .post("/form", { ...payload }, { cancelToken: req_cancel_token })
    .then((res) => res.data);
};

export const apiGetForm = ({ form_uri, req_cancel_token }) => {
  return http
    .get(`/form/${form_uri}`, {}, { cancelToken: req_cancel_token })
    .then((res) => res.data);
};

export const apiSubmitFormResponse = ({
  form_uuid,
  payload,
  req_cancel_token,
}) => {
  return http
    .post(
      `/response/${form_uuid}`,
      { ...payload },
      { cancelToken: req_cancel_token }
    )
    .then((res) => res.data);
};

export const apiGetFormResponseList = ({
  form_uri,
  page,
  req_cancel_token,
}) => {
  const params = {
    page: 1,
  };
  if (page) {
    params.page = page;
  }

  return http
    .get(`/response/${form_uri}`, { params }, { cancelToken: req_cancel_token })
    .then((res) => res.data);
};

export const apiGetFormResponsesCSV = ({ form_uri, req_cancel_token }) => {
  return http
    .get(
      `/response/${form_uri}/csv`,
      {
        responseType: "blob",
      },
      { cancelToken: req_cancel_token }
    )
    .then((res) => res.data);
};

export const apiGetFormResponsesJSON = ({ form_uri, req_cancel_token }) => {
  return http
    .get(`/response/${form_uri}/json`, {}, { cancelToken: req_cancel_token })
    .then((res) => res.data);
};
