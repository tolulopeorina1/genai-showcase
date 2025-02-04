import { getApiPathNoVersion } from "../config";
import * as http from "./httpService";

const apiProducts = getApiPathNoVersion("products", "");
const apiAdminProducts = getApiPathNoVersion("auth/admin/products", "");

export const getProductsApi = async (): Promise<any> => {
  try {
    return await http.apiCall.get(`${apiProducts}`, {
      headers: {
        // Authorization: token,
        "Location-Id": "Location-Id",
      },
    });
  } catch (error) {
    return error;
  }
};

export const createProductsApi = async (data: any): Promise<any> => {
  try {
    return await http.apiCall.post(`${apiProducts}`, data, {
      headers: {
        // Authorization: token,
        "Location-Id": "bdc_location",
      },
    });
  } catch (error) {
    return error;
  }
};

export const updateProductApi = async (data: any, id: string): Promise<any> => {
  try {
    return await http.apiCall.put(`${apiProducts}/${id}`, data, {
      headers: {
        // Authorization: token,
        "Location-Id": "bdc_location",
      },
    });
  } catch (error) {
    return error;
  }
};

export const deleteProductApi = async (id: string): Promise<any> => {
  try {
    return await http.apiCall.delete(`${apiProducts}/${id}`, {
      headers: {
        // Authorization: token,
        "Location-Id": "bdc_location",
      },
    });
  } catch (error) {
    return error;
  }
};

export const getAdminProductsApi = async (token: any): Promise<any> => {
  try {
    return await http.apiCall.get(`${apiAdminProducts}`, {
      headers: {
        Authorization: token,
      },
    });
  } catch (error) {
    return error;
  }
};
