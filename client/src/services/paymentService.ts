import api from "./api";

export const recordPayment = async (
  paymentData: any
) => {
  const response =
    await api.post(
      "/payments",
      paymentData
    );

  return response.data;
};

// ✅ NEW: fetch payment history for an invoice
export const getPaymentsByInvoice = async (
  invoiceId: string
) => {
  const response = await api.get(
    `/payments/invoice/${invoiceId}`
  );

  return response.data;
};