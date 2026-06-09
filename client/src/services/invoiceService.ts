import axios from "axios";

const API =
  "http://localhost:5000/api/invoices";

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
  async () => {

  const response =
    await axios.get(
      API,
      {
        headers: {
          Authorization:
            `Bearer ${getToken()}`
        }
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
