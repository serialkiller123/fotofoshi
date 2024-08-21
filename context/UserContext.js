import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  deleteAuthData,
  getToken,
  getUser,
  getSettings,
  deleteSettings,
} from "@/services/tokenService";
import { createAxiosInstance } from "@/services/api";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [baseURL, setBaseURL] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [apiKey, setApikey] = useState(null);

  const axios = createAxiosInstance(baseURL, apiKey);

  const getImages = async () => {
    try {
      const { data } = await axios.get("/api/images-app");
      return data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const fetchImages = async () => {
    if (!apiKey || !baseURL) {
      return;
    }
    try {
      const data = await getImages();
      if (Array.isArray(data)) {
        setImages(data);
        console.log(data);
      } else {
        console.error("Expected an array of images, but got:", data);
        setImages([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
    }
  };

  const initializeSettings = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const user = await getUser();
      const settings = await getSettings();
      // await deleteSettings();
      // await deleteAuthData();

      setApikey(settings.apiKey);
      setBaseURL(settings.websiteDomain);

      if (user && token) {
        setUser(user);
        setAuthToken(token);
      }
    } catch (error) {
      console.error("Failed to initialize user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeSettings();
  }, [initializeSettings]);

  useEffect(() => {
    fetchImages();
  }, [apiKey, baseURL]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        baseURL,
        authToken,
        apiKey,
        initializeSettings,
        images,
        fetchImages,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
