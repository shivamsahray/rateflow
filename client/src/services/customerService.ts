import axios from "axios";
import API_URL from "../config/api";

const API =
  `${API_URL}/customers`;

const getToken = () =>
  localStorage.getItem("token");

const headers = () => ({
  Authorization: `Bearer ${getToken()}`
});

export const getCustomers = async () => {
  const response = await axios.get(API, {
    headers: headers()
  });

  return response.data;
};

export const createCustomer = async (
  customerData: any
) => {
  const response = await axios.post(
    API,
    customerData,
    {
      headers: headers()
    }
  );

  return response.data;
};

export const updateCustomer = async (id: string, customerData: any) => {
  const response = await axios.put(`${API}/${id}`, customerData, {
    headers: headers(),
  });
  return response.data;
};
 
export const deleteCustomer = async (
  id: string
) => {
  const response = await axios.delete(
    `${API}/${id}`,
    {
      headers: headers()
    }
  );

  return response.data;
};