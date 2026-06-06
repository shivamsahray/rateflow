import axios from "axios";

const API =
  "http://localhost:5000/api/pricing";

const getToken = () =>
  localStorage.getItem("token");

export const getLastPrice =
  async (
    customerId: string,
    productId: string
  ) => {

    const response =
      await axios.get(
        `${API}/last-price`,
        {
          params: {
            customerId,
            productId,
          },

          headers: {
            Authorization:
              `Bearer ${getToken()}`
          }
        }
      );

    return response.data;
  };