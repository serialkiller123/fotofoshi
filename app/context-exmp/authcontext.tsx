// import React, { createContext, useContext, useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// const API_URL = "http://192.168.202.251:8000";

// // Define the shape of the authentication context
// interface AuthContextProps {
//   user: any;
//   isAuthenticated: boolean;
//   login: (data: any) => Promise<void>;
//   logout: () => Promise<void>;
//   register: (data: any) => Promise<void>;
// }

// // Create the Auth context
// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<any>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Check authentication state on app load
//   useEffect(() => {
//     const checkAuthState = async () => {
//       const storedToken = await AsyncStorage.getItem("token");
//       if (storedToken) {
//         axios.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${storedToken}`;
//         try {
//           const response = await axios.get(`${API_URL}/api/user`);
//           setUser(response.data);
//           console.log(response.data);
//           setIsAuthenticated(true);
//         } catch (error) {
//           console.error("Failed to verify token", error);
//           setIsAuthenticated(false);
//           await AsyncStorage.removeItem("token");
//         }
//       }
//     };
//     checkAuthState();
//   }, []);

//   // Handle user login
//   const login = async (data: any) => {
//     try {
//       const response = await axios.post(`${API_URL}/api/login`, data);
//       const { token, user } = response.data;

//       // Save token and user data
//       await AsyncStorage.setItem("token", token);
//       setUser(user);
//       setIsAuthenticated(true);

//       // Set default authorization header for axios
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     } catch (error) {
//       console.error("Login failed", error);
//       throw error;
//     }
//   };

//   // Handle user registration
//   const register = async (data: any) => {
//     try {
//       await axios.post(`${API_URL}/api/register`, data);
//       await login(data); // Log in the user after registration
//     } catch (error) {
//       console.error("Registration failed", error);
//       throw error;
//     }
//   };

//   // Handle user logout
//   const logout = async () => {
//     try {
//       await axios.post(`${API_URL}/api/logout`);
//       setUser(null);
//       setIsAuthenticated(false);
//       await AsyncStorage.removeItem("token");
//       delete axios.defaults.headers.common["Authorization"];
//     } catch (error) {
//       console.error("Logout failed", error);
//       throw error;
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, isAuthenticated, login, logout, register }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use the Auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://c63a-202-153-82-235.ngrok-free.app";
const apiKey = "Hg4ef7xqmRxMoPOdeR3fbJFDlOuIQhjxL8jfCIVZ";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [apiKey, setApiKey] = useState(
  //   "Hg4ef7xqmRxMoPOdeR3fbJFDlOuIQhjxL8jfCIVZ"
  // );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        setIsAuthenticated(!!token);
        // console.log(token);

        // Optionally load the API key from storage
        // const storedApiKey = await AsyncStorage.getItem("apiKey");
        // if (storedApiKey) {
        //   setApiKey(storedApiKey);
        // }
      } catch (error) {
        console.error("Error checking authentication", error);
      }
    };

    checkAuth();
  }, []);

  const csrf = async () => {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  };

  const login = async (email, password) => {
    try {
      await csrf(); // Ensure CSRF token is fetched before login

      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          // withCredentials: true, // Important for CSRF protection
        }
      );

      const { token } = response.data;
      if (token) {
        await AsyncStorage.setItem("authToken", token);
        setIsAuthenticated(true);
        console.log("Token", token);
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const register = async (name, email, password) => {
    try {
      await csrf();

      const response = await axios.post(
        `${API_URL}/register`,
        { name, email, password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          // withCredentials: true, // Important for CSRF protection
        }
      );

      const { token } = response.data;
      if (token) {
        await AsyncStorage.setItem("authToken", token);
        setIsAuthenticated(true);
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return { isAuthenticated, login, register, logout, apiKey };
}
