// functions that start with __ are local to this file
// and not to be exported

const __FORM_AUTHOR_TOKEN_KEY__ = "formAuthorToken";
const __APP_USERNAME_KEY__ = "appUsername";

const __storageGet = (key) => {
  return localStorage.getItem(key);
};

const __storagePut = ({ key, value }) => {
  // even of we pass a number or any other type for "value"
  // stringify will convert it to string
  let val = value;
  if (typeof value === "object") {
    val = JSON.stringify(val);
  }
  localStorage.setItem(key, val);
  return;
};

const __storageDel = (key) => {
  return localStorage.removeItem(key);
};

export const getAuthorToken = () => __storageGet(__FORM_AUTHOR_TOKEN_KEY__);

export const putAuthorToken = (token) => {
  __storagePut({
    key: __FORM_AUTHOR_TOKEN_KEY__,
    value: token,
  });
  return;
};

export const delAuthorToken = () => __storageDel(__FORM_AUTHOR_TOKEN_KEY__);

export const getAppUsername = () => __storageGet(__APP_USERNAME_KEY__);

export const putAppUsername = (name) => {
  __storagePut({
    key: __APP_USERNAME_KEY__,
    value: name,
  });
  return;
};

export const delAppUsername = () => __storageDel(__APP_USERNAME_KEY__);
