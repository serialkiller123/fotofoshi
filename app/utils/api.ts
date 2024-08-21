import axiosLib from "axios";

const API_URL = "https://c63a-202-153-82-235.ngrok-free.app";
const apiKey = "Hg4ef7xqmRxMoPOdeR3fbJFDlOuIQhjxL8jfCIVZ";
let sanctumToken = "";

// Create an Axios instance
const axios = axiosLib.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    // Authorization: `Bearer ${apiKey}`, // Default API key for initial requests
  },
  //   withCredentials: true,
});

// Function to request a token
const requestToken = async (email, password, deviceName) => {
  try {
    // Get CSRF token from the server before making the request
    await axios.get(`${API_URL}/sanctum/csrf-cookie`);

    // Request token with CSRF token included
    const response = await axios.post(`${API_URL}/api/sanctum/token`, {
      email,
      password,
      device_name: deviceName,
    });

    const token = response.data; // This should be the token returned from the backend
    console.log("Token:", token);
    return token;
  } catch (error) {
    console.error(
      "Error requesting token:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export { axios, requestToken };
