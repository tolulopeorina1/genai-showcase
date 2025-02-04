import axios from "axios";

axios.interceptors.response.use(null, (err) => {
  const expectedError = err.response && err.response.status >= 400;
  if (!expectedError) {
    console.log(err);
    console.error("An unexpected error occurred");
  }
  return Promise.reject(err);
});

const apiAxios = (url: any) => {
  axios.create({
    baseURL: url,
    headers: {
      "Content-Type": "application/json",
      crossDomain: true,
    },
  });
};

export const apiCall = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  api: apiAxios,
};
