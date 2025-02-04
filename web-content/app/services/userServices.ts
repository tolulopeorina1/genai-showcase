import { getApiPathNoVersion } from "../config";
import * as http from "./httpService";

const apiUser = getApiPathNoVersion("auth", "");
export const createUserApi = async (data: any): Promise<any> => {
  try {
    return await http.apiCall.post(`${apiUser}/register`, data, {
      headers: {
        // Authorization: token,
      },
    });
  } catch (error) {
    return error;
  }
};

export const loginUserApi = async (data: any): Promise<any> => {
  try {
    const userData = await http.apiCall.post(`${apiUser}/login`, data, {
      headers: {
        // Authorization: token,
      },
    });
    if (userData?.data?.success) {
      authenticateUser(userData?.data?.message);
    }

    return userData;
  } catch (error) {
    return error;
  }
};

export const authenticateUser = (res: any) => {
  const userAcToken = res;
  if (typeof window !== "undefined") {
    sessionStorage.setItem("userAcToken", JSON.stringify(userAcToken));
    localStorage.setItem("userAcToken", JSON.stringify(userAcToken));
  } else {
    sessionStorage.setItem("userAcToken", JSON.stringify(userAcToken));
    localStorage.setItem("userAcToken", JSON.stringify(userAcToken));
  }
};

export const IsAuthenticated = () => {
  if (
    (typeof window !== "undefined" && sessionStorage.getItem("userAcToken")) ||
    localStorage.getItem("userAcToken")
  ) {
    try {
      const token =
        JSON.parse(sessionStorage.getItem("userAcToken") || "") ||
        JSON.parse(localStorage.getItem("userAcToken") || "");

      if (token) return true;
    } catch (error) {
      error;
    }
  }
  return false;
};

export const getClientData = () => {
  if (
    (typeof window !== "undefined" && sessionStorage.getItem("userAcToken")) ||
    localStorage.getItem("userAcToken")
  ) {
    try {
      const token =
        JSON.parse(sessionStorage.getItem("userAcToken") || "") ||
        JSON.parse(localStorage.getItem("userAcToken") || "");
      if (token) return token;
    } catch (error) {
      error;
    }
  }
  // return false;
};
