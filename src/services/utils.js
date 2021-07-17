// https://github.com/axios/axios#handling-errors
export const getAxiosError = (e) => {
  let message = "Unknown error while contacting service";
  if (e.response) {
    // Request made and server responded
    if (e.response.data && e.response.data.message) {
      message = e.response.data.message;
    }
  } else if (e.request) {
    // The request was made but no response was received
    message = "Did not receive response from service";
  } else {
    // Something happened in setting up the request that triggered an Error
    message = e.message;
  }
  return message;
};

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
export const getRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const makeFormattedDate = (date) => {
  const d = new Date(date);
  const dateString =
    d.getFullYear() +
    "/" +
    (d.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    d.getDate();
  return dateString;
};

// https://stackoverflow.com/questions/8362952/javascript-output-current-datetime-in-yyyy-mm-dd-hhmsec-format
export const makeFormattedDateTime = (date) => {
  if (!date) {
    return "";
  }
  const d = new Date(date);
  const offsetMs = d.getTimezoneOffset() * 60 * 1000;
  const dateLocal = new Date(d.getTime() - offsetMs);
  const str = dateLocal
    .toISOString()
    .slice(0, 19)
    .replace(/-/g, "/")
    .replace("T", " ");
  return str;
};
