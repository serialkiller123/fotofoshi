import axiosLib, { AxiosError } from "axios";

export const createAxiosInstance = (baseURL: string, apiKey: string) => {
  return axiosLib.create({
    baseURL: baseURL,
    headers: {
      Accept: "application/json",
      "x-api-key": apiKey,
    },
  });
};

export const handleError = (error: AxiosError) => {
  if (error.response) {
    console.error("Data:", error.response.data);
    console.error("Status:", error.response.status);
    console.error("Headers:", error.response.headers);
  } else if (error.request) {
    console.error("Request:", error.request);
  } else {
    console.error("Error", error.message);
  }
};
