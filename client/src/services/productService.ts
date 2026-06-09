import axios from "axios";

const API =
  "http://localhost:5000/api/products";

const getToken = () =>
  localStorage.getItem("token");

const headers = () => ({
  Authorization: `Bearer ${getToken()}`
});

export const getProducts = async () => {
  const response = await axios.get(API, {
    headers: headers()
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