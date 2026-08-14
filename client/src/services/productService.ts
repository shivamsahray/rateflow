import axios from "axios";
import API_URL from "../config/api";

const API =
  `${API_URL}/products`;

const getToken = () =>
  localStorage.getItem("token");

const headers = () => ({
  Authorization: `Bearer ${getToken()}`
});

export const getProducts = async (opts?: { page?: number; limit?: number; search?: string }) => {
  const params: any = {};

  if (opts?.page) params.page = opts.page;
  if (opts?.limit) params.limit = opts.limit;
  if (opts?.search) params.search = opts.search;

  const response = await axios.get(API, {
    headers: headers(),
    params,
  });

  return response.data;
};

export const createProduct = async (
  productData: any
) => {
  const response = await axios.post(
    API,
    productData,
    {
      headers: headers()
    }
  );

  return response.data;
};

export const updateProduct = async (id: string, productData: any) => {
  const response = await axios.put(`${API}/${id}`, productData, {
    headers: headers(),
  });
  return response.data;
};
 
export const deleteProduct = async (
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