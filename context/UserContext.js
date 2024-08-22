import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  deleteAuthData,
  getToken,
  getUser,
  getSettings,
  deleteSettings,
} from "@/services/tokenService";
import { createAxiosInstance, handleError } from "@/services/api";
import axios from "axios";
import { router } from "expo-router";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [baseURL, setBaseURL] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [apiKey, setApikey] = useState(null);
  const Axios = createAxiosInstance(baseURL, apiKey);

  const dispatchPhoto = (photo) => {
    setSelectedImage(photo);
  };

  const handleDiscard = () => {
    setSelectedImage(null);
    router.push("/");
  };

  const getImages = async () => {
    try {
      const { data } = await Axios.get("/api/images-app");
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
        // console.log(data);
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

      if (token) {
        const response = await axios.get(
          `${settings.websiteDomain}/api/user`,

          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log("My Usercontext", response.data);
        // console.log("token---", token);
        setUser(response.data);
      }

      if (user) {
        // setUser(user);
        setAuthToken(token);
      }
    } catch (error) {
      handleError(error);
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
        selectedImage,
        setSelectedImage,
        dispatchPhoto,
        handleDiscard,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
