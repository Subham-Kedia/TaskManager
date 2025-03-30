import axios from "axios";
// import {
//   getSavedUserDCId,
//   getUserData,
//   //   removeUser,
//   saveUserData,
// } from "Utilities/localStorage";
import { notifyUser } from "../utilities";

const AUTH_TOKEN_KEY = "auth_token";

const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

let auth_token = getAuthToken();

const setAuthToken = (token: string): void => {
  auth_token = token;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

const removeAuthToken = (): void => {
  auth_token = null;
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

const serviceConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const getServiceInstance = (baseURL: string) => {
  const serviceInstance = axios.create({
    ...serviceConfig,
    ...{ baseURL },
  });

  serviceInstance.interceptors.request.use((config) => {
    const modifiedConfig = { ...config };
    if (auth_token) {
      modifiedConfig.headers.Authorization = auth_token;
    }
    return modifiedConfig;
  });

  serviceInstance.interceptors.response.use(
    (response) => {
      if (response.headers.authorization) {
        setAuthToken(response.headers.authorization);
      }

      return response.data;
    },
    (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      notifyUser(errorMessage, "error");

      if (
        // error.config.url !== "" &&
        error.response &&
        error.response.status === 401
      ) {
        removeAuthToken();
        window.location.href = "/login";
        return;
      }

      throw error;
    }
  );
  return serviceInstance;
};

export const taskManagerService = getServiceInstance(
  `${import.meta.env.VITE_SUPPLY_CHAIN_SERVICE}/`
);
