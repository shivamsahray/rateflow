import axios from "axios";
import API_URL from "../config/api";

const API =
  `${API_URL}/invoices`;

const getToken = () =>
  localStorage.getItem("token");

export const createInvoice =
  async (
    invoiceData: any
  ) => {

    const response =
      await axios.post(
        API,
        invoiceData,
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`
          }
        }
      );

    return response.data;
  };


export const getInvoices =
  async (
    page?: number,
    limit?: number,
    search = ""
  ) => {

  const response =
    await axios.get(
      API,
      {
        headers: {
          Authorization:
            `Bearer ${getToken()}`
        },
        params: page !== undefined
          ? { page, limit: limit || 10, search }
          : { search }
      }
    );

  return response.data;
};

export const getInvoiceById =
  async (
    id: string
  ) => {

  const response =
    await axios.get(
      `${API}/${id}`,
      {
        headers: {
          Authorization:
            `Bearer ${getToken()}`
        }
      }
    );

  return response.data;
};


export const getNextInvoiceNumber =
  async () => {

    const response =
      await axios.get(
        `${API}/next-number`,
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`
          }
        }
      );

    return response.data;
  };


export const updateInvoice = async (id: string, data: any) => {
  const res = await axios.put(`${API}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};
 
export const deleteInvoice = async (id: string) => {
  const res = await axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};