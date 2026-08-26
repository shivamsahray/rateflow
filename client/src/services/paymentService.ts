import api from "./api";

export const recordPayment = async (paymentData: any) => {
  const response = await api.post("/payments", paymentData);
  return response.data;
};

export const getPayments = async (page = 1, limit = 25, search = "") => {
  const response = await api.get("/payments", {
    params: { page, limit, search },
  });

  return response.data;
};

export const getPaymentById = async (paymentId: string) => {
  const response = await api.get(`/payments/${paymentId}`);
  return response.data;
};

export const updatePayment = async (paymentId: string, paymentData: any) => {
  const response = await api.put(`/payments/${paymentId}`, paymentData);
  return response.data;
};

export const deletePayment = async (paymentId: string) => {
  const response = await api.delete(`/payments/${paymentId}`);
  return response.data;
};

export const getPaymentsByInvoice = async (invoiceId: string) => {
  const response = await api.get(`/payments/invoice/${invoiceId}`);
  return response.data;
};