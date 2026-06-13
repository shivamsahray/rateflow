import api from "./api";

export const getSettings =
async () => {

  const response =
    await api.get(
      "/settings"
    );

  return response.data;
};

export const updateSettings =
async (data: any) => {

  const response =
    await api.put(
      "/settings",
      data
    );

  return response.data;
};

export const getWhatsAppQR =
async () => {

  const response =
    await api.get(
      "/settings/whatsapp/qr"
    );

  return response.data;
};