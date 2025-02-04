import * as http from "./httpService";
import { endpointData } from "../constants/endpointa";
export const checkFraudApi = async (data: any): Promise<any> => {
  try {
    return await http.apiCall.post(`${endpointData.fraudDetection}`, data, {
      headers: {
        // Authorization: token,
      },
    });
  } catch (error) {
    return error;
  }
};
