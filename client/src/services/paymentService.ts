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

