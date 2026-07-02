import axios from "axios";
import API_URL from "../config/api";

const API = `${API_URL}/purchases`;
const getToken = () => localStorage.getItem("token");
const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const getPurchases = async () => {
  const response = await axios.get(API, { headers: headers() });
  return response.data;
};

export const createPurchase = async (purchaseData: any) => {
  const response = await axios.post(API, purchaseData, { headers: headers() });
  return response.data;
};

export const getPurchaseById = async (id: string) => {
  const response = await axios.get(`${API}/${id}`, { headers: headers() });
  return response.data;
};

export const deletePurchase = async (id: string) => {
  const response = await axios.delete(`${API}/${id}`, { headers: headers() });
  return response.data;
};
