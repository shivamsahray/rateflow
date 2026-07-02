import axios from "axios";
import API_URL from "../config/api";

const API = `${API_URL}/vendors`;

const getToken = () => localStorage.getItem("token");
const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const getVendors = async () => {
  const response = await axios.get(API, { headers: headers() });
  return response.data;
};

export const createVendor = async (vendorData: any) => {
  const response = await axios.post(API, vendorData, { headers: headers() });
  return response.data;
};

export const updateVendor = async (id: string, vendorData: any) => {
  const response = await axios.put(`${API}/${id}`, vendorData, { headers: headers() });
  return response.data;
};

export const deleteVendor = async (id: string) => {
  const response = await axios.delete(`${API}/${id}`, { headers: headers() });
  return response.data;
};
