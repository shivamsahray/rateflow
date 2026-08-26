import axios from "axios";
import API_URL from "../config/api";

const API = `${API_URL}/customers`;

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const getCustomersPage = async (page = 1, limit = 25, search = "") => {
  const response = await axios.get(API, {
    headers: headers(),
    params: { page, limit, search },
  });

  return response.data;
};

export const getCustomers = async (params?: { page?: number; limit?: number; search?: string; all?: boolean }) => {
  if (!params || params.all || (!params.page && !params.limit && !params.search && !params.all)) {
    const response = await axios.get(`${API}/all`, {
      headers: headers(),
    });
    return response.data;
  }

  return getCustomersPage(params.page ?? 1, params.limit ?? 25, params.search ?? "");
};

export const searchCustomers = async (query = "", limit = 20) => {
  const response = await axios.get(`${API}/search`, {
    headers: headers(),
    params: { query, limit },
  });

  return response.data;
};

export const createCustomer = async (customerData: any) => {
  const response = await axios.post(API, customerData, {
    headers: headers(),
  });

  return response.data;
};

export const updateCustomer = async (id: string, customerData: any) => {
  const response = await axios.put(`${API}/${id}`, customerData, {
    headers: headers(),
  });
  return response.data;
};

export const deleteCustomer = async (id: string) => {
  const response = await axios.delete(`${API}/${id}`, {
    headers: headers(),
  });

  return response.data;
};