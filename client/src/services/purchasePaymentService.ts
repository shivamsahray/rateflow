import axios from "axios";
import API_URL from "../config/api";

const API = `${API_URL}/purchase-payments`;
const getToken = () => localStorage.getItem("token");
const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const getPurchasePayments = async () => {
  const response = await axios.get(API, { headers: headers() });
  return response.data;
};

export const createPurchasePayment = async (paymentData: any) => {
  const response = await axios.post(API, paymentData, { headers: headers() });
  return response.data;
};

export const deletePurchasePayment = async (id: string) => {
  const response = await axios.delete(`${API}/${id}`, { headers: headers() });
  return response.data;
};
