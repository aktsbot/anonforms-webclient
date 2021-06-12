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
