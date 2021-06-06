import axios from "axios";

const __BASE_API_ROUTE__ = '/api/v1';

// this is exported as the auth component uses this to set
// the authorization token afterwards
export default axios.create({
  baseURL: process.env.REACT_APP_API + __BASE_API_ROUTE__,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// all api endpoint methods are set here as the entire app is tiny

// sends a secret code to the email provided
export apiAuth = ({email}) => {
  return axios.post('/user/auth', {email});
}

// gets a session token from the provided email and auth_code
export apiSession = ({email, auth_code}) => {
  return axios.post('/user/session', {email, auth_code});
}
